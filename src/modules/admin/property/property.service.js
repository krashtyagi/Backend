const mongoose = require("mongoose");
const crypto = require("crypto");

const Vendor = require("../../vendors/vendor.model");
const User = require("../../auth/auth.model");
const VendorBank = require("../../vendorBank/bank.model");
const Hotel = require("../../hotels/hotel.model");

const {
  sendVendorApprovalEmail,
  sendVendorRejectionEmail,
} = require("../../../shared/utils/sendEmail");

const CabCompany = require("../../cab/company/cab.model");
const BikeCompany = require("../../bike/company/bike.model");
const TourCompany = require("../../tour/company/tour.model");
const AdventureCompany = require("../../adventure/category/adventure.model");

const serviceModelMap = {
  hotel: Hotel,
  cab: CabCompany,
  bike: BikeCompany,
  tour: TourCompany,
  adventure: AdventureCompany,
};

exports.getAllProperties = async (query) => {
  try {
    const { page = 1, limit = 10, status, search, serviceType } = query;

    const skip = (page - 1) * limit;

    const matchStage = {};

    if (status) {
      matchStage.status = status;
    }

    if (serviceType) {
      matchStage.serviceType = serviceType;
    }

    // DYNAMIC COLLECTION MAP
    const serviceCollectionMap = {
      hotel: "hotels",
      cab: "cabcompanies",
      bike: "bikecompanies",
      tour: "tourcompanies",
      adventure: "adventures",
    };

    const lookupCollection = serviceCollectionMap[serviceType] || "hotels";

    const pipeline = [
      {
        $match: matchStage,
      },

      // USER JOIN
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },

      // BUSINESS JOIN
      {
        $lookup: {
          from: lookupCollection,
          localField: "_id",
          foreignField: "vendorId",
          as: "business",
        },
      },

      {
        $unwind: {
          path: "$business",
          preserveNullAndEmptyArrays: true,
        },
      },

      // SEARCH
      ...(search
        ? [
            {
              $match: {
                $or: [
                  {
                    "business.name": {
                      $regex: search,
                      $options: "i",
                    },
                  },

                  {
                    "business.city": {
                      $regex: search,
                      $options: "i",
                    },
                  },

                  {
                    "business.location.city": {
                      $regex: search,
                      $options: "i",
                    },
                  },

                  {
                    "user.firstName": {
                      $regex: search,
                      $options: "i",
                    },
                  },

                  {
                    "user.lastName": {
                      $regex: search,
                      $options: "i",
                    },
                  },

                  // SEARCH BY PROPERTY ID
                  {
                    propertyId: {
                      $regex: search,
                      $options: "i",
                    },
                  },
                ],
              },
            },
          ]
        : []),

      {
        $project: {
          _id: 1,

          propertyId: 1,

          serviceType: 1,

          businessName: {
            $ifNull: ["$business.name", "N/A"],
          },

          city: {
            $ifNull: ["$business.city", "$business.location.city"],
          },

          vendorName: {
            $trim: {
              input: {
                $concat: [
                  {
                    $ifNull: ["$user.firstName", ""],
                  },
                  " ",
                  {
                    $ifNull: ["$user.lastName", ""],
                  },
                ],
              },
            },
          },

          status: 1,

          submittedAt: 1,

          rank: {
            $ifNull: ["$business.rank", "C"],
          },

          verificationStatus: "$business.verificationStatus",

          canAssignRank: {
            $cond: [
              {
                $eq: ["$business.verificationStatus", "verified"],
              },
              true,
              false,
            ],
          },
        },
      },

      {
        $sort: {
          submittedAt: -1,
        },
      },

      {
        $facet: {
          data: [{ $skip: skip }, { $limit: Number(limit) }],

          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ];

    const result = await Vendor.aggregate(pipeline);

    const properties = result[0].data;

    const total = result[0].totalCount[0]?.count || 0;

    return {
      properties,

      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    };
  } catch (error) {
    throw error;
  }
};

exports.getPropertyDetail = async (vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      throw new Error("Invalid vendor ID");
    }

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    const user = await User.findById(vendor.userId);

    const bank = await VendorBank.findOne({
      vendorId,
    }).select("+accountNumber +ifscCode +upiId");

    // DYNAMIC BUSINESS FETCH
    let business = null;

    switch (vendor.serviceType) {
      case "hotel":
        business = await Hotel.findOne({
          vendorId,
        });
        break;

      case "cab":
        business = await CabCompany.findOne({
          vendorId,
        });
        break;

      case "bike":
        business = await BikeCompany.findOne({
          vendorId,
        });
        break;

      case "tour":
        business = await TourCompany.findOne({
          vendorId,
        });
        break;

      case "adventure":
        business = await AdventureCompany.findOne({
          vendorId,
        });
        break;

      default:
        business = null;
    }

    return {
      vendor: {
        _id: vendor._id,

        propertyId: vendor.propertyId || null,

        status: vendor.status,

        submittedAt: vendor.submittedAt,

        serviceType: vendor.serviceType,

        rejectedSteps: vendor.rejectedSteps || [],

        rejectionReasons: vendor.rejectionReasons || {},
      },

      user: {
        name: user ? `${user.firstName} ${user.lastName}` : "",

        email: user?.email || "",

        phone: user?.phoneNumber || "",
      },

      businessDetails: {
        businessName: vendor.businessName,

        businessEmail: vendor.businessEmail,

        businessPhone: vendor.businessPhone,

        address: vendor.businessAddress,

        city: vendor.city,

        state: vendor.state,

        country: vendor.country,

        panNumber: vendor.panNumber,

        aadhaarNumber: vendor.aadhaarNumber,
      },

      documents: vendor.verificationDocs || [],

      bankDetails: bank
        ? {
            accountHolderName: bank.accountHolderName,

            bankName: bank.bankName,

            accountNumber: bank.accountNumber,

            ifscCode: bank.ifscCode,

            branchName: bank.branchName,

            upiId: bank.upiId,

            proof: bank.bankProof,

            verificationStatus: bank.verificationStatus,
          }
        : null,

      propertyDetails: business
        ? {
            name: business.name,

            description: business.description,

            address: business.address,

            city: business.city || business?.location?.city,

            images: business.images,

            documents: business.documents || [],

            features: business.features || [],

            amenities: business.amenities || [],

            accessibility: business.accessibility || {},

            verificationStatus: business.verificationStatus,

            rank: business.rank,

            isFeatured: business.isFeatured,
          }
        : null,
    };
  } catch (error) {
    throw error;
  }
};

exports.approveVendor = async (vendorId, adminId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      throw new Error("Invalid vendor ID");
    }

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    if (!vendor.isSubmitted) {
      throw new Error("Vendor has not submitted onboarding");
    }

    // AUTO VERIFY VENDOR DOCS
    if (vendor.verificationDocs && vendor.verificationDocs.length > 0) {
      vendor.verificationDocs = vendor.verificationDocs.map((doc) => ({
        ...doc.toObject(),
        isVerified: true,
      }));
    }

    // BANK VERIFY
    await VendorBank.findOneAndUpdate(
      { vendorId },
      {
        verificationStatus: "verified",
      },
    );

    // DYNAMIC BUSINESS FETCH
    let business = null;

    switch (vendor.serviceType) {
      case "hotel":
        business = await Hotel.findOne({
          vendorId,
        });
        break;

      case "cab":
        business = await CabCompany.findOne({
          vendorId,
        });
        break;

      case "bike":
        business = await BikeCompany.findOne({
          vendorId,
        });
        break;

      case "tour":
        business = await TourCompany.findOne({
          vendorId,
        });
        break;

      case "adventure":
        business = await AdventureCompany.findOne({
          vendorId,
        });
        break;

      default:
        business = null;
    }

    // VERIFY BUSINESS
    if (business) {
      business.verificationStatus = "verified";

      business.isActive = true;

      // VERIFY BUSINESS DOCS
      if (business.documents && business.documents.length > 0) {
        business.documents = business.documents.map((doc) => ({
          ...doc.toObject(),
          isVerified: true,
        }));
      }

      await business.save();
    }

    //GENERATE UNIQUE 6-DIGIT PROPERTY ID (only if not already set)
    if (!vendor.propertyId) {
      let uniqueId;
      let isUnique = false;

      while (!isUnique) {
        uniqueId = String(Math.floor(100000 + crypto.randomInt(900000)));
        const existing = await Vendor.findOne({ propertyId: uniqueId });
        if (!existing) isUnique = true;
      }

      vendor.propertyId = uniqueId;
    }

    // CLEAR REJECTIONS
    vendor.rejectedSteps = [];

    vendor.rejectionReasons = {};

    vendor.status = "approved";

    vendor.approvedAt = new Date();

    vendor.approvedBy = adminId;

    // SEND EMAIL
    sendVendorApprovalEmail(vendor).catch((err) => {
      console.error("Approval email failed:", err.message);
    });

    await vendor.save();

    return vendor;
  } catch (error) {
    throw error;
  }
};

exports.updateBusinessRank = async (serviceType, businessId, rank) => {
  try {
    const validRanks = ["A", "B", "C"];

    if (!validRanks.includes(rank)) {
      throw new Error("Invalid rank value");
    }

    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      throw new Error("Invalid business ID");
    }

    const BusinessModel = serviceModelMap[serviceType];

    if (!BusinessModel) {
      throw new Error("Invalid service type");
    }

    const business = await BusinessModel.findById(businessId);

    if (!business) {
      throw new Error("Business not found");
    }

    // ONLY VERIFIED BUSINESSES
    if (business.verificationStatus !== "verified") {
      throw new Error("Only verified businesses can be ranked");
    }

    // AVOID UNNECESSARY WRITE
    if (business.rank === rank) {
      return business;
    }

    business.rank = rank;

    await business.save();

    return business;
  } catch (error) {
    throw error;
  }
};

exports.markIssue = async (vendorId, step, reason, adminId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      throw new Error("Invalid vendor ID");
    }

    if (![2, 3, 4].includes(step)) {
      throw new Error("Invalid step");
    }

    if (!reason || !reason.trim()) {
      throw new Error("Reason is required");
    }

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    if (!vendor.rejectedSteps) {
      vendor.rejectedSteps = [];
    }

    if (!vendor.rejectionReasons) {
      vendor.rejectionReasons = {};
    }

    if (!vendor.rejectedSteps.includes(step)) {
      vendor.rejectedSteps.push(step);
    }

    vendor.rejectionReasons = {
      ...(vendor.rejectionReasons || {}),

      [step]: reason.trim(),
    };

    vendor.status = "under_review";

    vendor.reviewedBy = adminId;

    vendor.reviewedAt = new Date();

    await vendor.save();

    return vendor;
  } catch (error) {
    throw error;
  }
};

exports.verifySection = async (vendorId, step) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      throw new Error("Invalid vendor ID");
    }

    if (![2, 3, 4].includes(step)) {
      throw new Error("Invalid step");
    }

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    if (vendor.rejectedSteps?.includes(step)) {
      vendor.rejectedSteps = vendor.rejectedSteps.filter((s) => s !== step);

      // REMOVE REASON
      if (vendor.rejectionReasons) {
        delete vendor.rejectionReasons[step];
      }
    }

    if (step === 2) {
      if (vendor.verificationDocs && vendor.verificationDocs.length > 0) {
        vendor.verificationDocs = vendor.verificationDocs.map((doc) => ({
          ...doc.toObject(),

          isVerified: true,
        }));
      }
    }

    if (step === 3) {
      await VendorBank.findOneAndUpdate(
        {
          vendorId,
        },

        {
          verificationStatus: "verified",
        },
      );
    }

    if (step === 4) {
      const BusinessModel = serviceModelMap[vendor.serviceType];

      if (BusinessModel) {
        const business = await BusinessModel.findOne({
          vendorId,
        });

        if (business) {
          business.verificationStatus = "verified";

          business.isActive = true;

          // VERIFY DOCS
          if (business.documents && business.documents.length > 0) {
            business.documents = business.documents.map((doc) => ({
              ...doc.toObject(),

              isVerified: true,
            }));
          }

          await business.save();
        }
      }
    }

    if (!vendor.rejectedSteps || vendor.rejectedSteps.length === 0) {
      vendor.status = "pending";
    }

    vendor.reviewedAt = new Date();

    await vendor.save();

    return vendor;
  } catch (error) {
    throw error;
  }
};

exports.rejectVendor = async (vendorId, body) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      throw new Error("Invalid vendor ID");
    }

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    if (body.rejectedSteps && body.reasons) {
      vendor.rejectedSteps = body.rejectedSteps;

      vendor.rejectionReasons = body.reasons;
    }

    if (!vendor.rejectedSteps || vendor.rejectedSteps.length === 0) {
      throw new Error("No issues found to reject");
    }

    vendor.status = "rejected";

    vendor.rejectedAt = new Date();

    vendor.reviewedAt = new Date();

    const BusinessModel = serviceModelMap[vendor.serviceType];

    if (BusinessModel) {
      const business = await BusinessModel.findOne({
        vendorId,
      });

      if (business) {
        business.isActive = false;

        business.verificationStatus = "rejected";

        await business.save();
      }
    }

    if (vendor.businessEmail) {
      sendVendorRejectionEmail(vendor).catch((err) => {
        console.error("Rejection email failed:", err.message);
      });
    }

    await vendor.save();

    return vendor;
  } catch (error) {
    throw error;
  }
};
