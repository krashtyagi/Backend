const Vendor = require("./vendor.model");
const VendorBank = require("../vendorBank/bank.model");
const User = require("../../modules/auth/auth.model");

const Hotel = require("../hotels/hotel.model");
const CabCompany = require("../cab/company/cab.model");
const BikeCompany = require("../bike/company/bike.model");
const TourCompany = require("../tour/company/tour.model");
const Adventure = require("../adventure/category/adventure.model");

const SERVICE_MODELS = {
  hotel: Hotel,
  cab: CabCompany,
  bike: BikeCompany,
  tour: TourCompany,
  adventure: Adventure,
};

const {
  sendAdminVendorNotificationEmail,
  sendVendorSubmissionConfirmationEmail,
} = require("../../shared/utils/sendEmail");

const logger = require("../../shared/utils/logger");

exports.getVendorMe = async (userId) => {
  try {
    // USER
    const user = await User.findById(userId).select("firstName lastName email");

    if (!user) {
      throw new Error("User not found");
    }

    // VENDOR
    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    // BANK
    const bank = await VendorBank.findOne({
      vendorId: vendor._id,
      isActive: true,
    }).select("+accountNumber +ifscCode +upiId");

    // SERVICE MODEL
    const ServiceModel = SERVICE_MODELS[vendor.serviceType];

    let serviceData = null;

    // FETCH SERVICE DATA
    if (ServiceModel) {
      serviceData = await ServiceModel.findOne({
        vendorId: vendor._id,
        isActive: true,
      });
    }

    // DYNAMIC SERVICE DETAILS
    let serviceDetails = null;

    if (serviceData) {
      switch (vendor.serviceType) {
        // HOTEL
        case "hotel":
          serviceDetails = {
            serviceType: "hotel",

            id: serviceData._id,
            name: serviceData.name,
            description: serviceData.description,

            address: serviceData.address,
            city: serviceData.city,

            images: serviceData.images || [],
            documents: serviceData.documents || [],

            amenities: serviceData.amenities || [],

            accessibility: serviceData.accessibility || {},

            rating: serviceData.rating || 0,
            numReviews: serviceData.numReviews || 0,

            verificationStatus: serviceData.verificationStatus,
            rank: serviceData.rank,
            isFeatured: serviceData.isFeatured,
          };

          break;

        // CAB
        case "cab":
          serviceDetails = {
            serviceType: "cab",

            id: serviceData._id,
            name: serviceData.name,
            description: serviceData.description,

            location: serviceData.location || {},
            address: serviceData.address,

            coordinates: serviceData.coordinates || {},

            images: serviceData.images || [],
            documents: serviceData.documents || [],

            features: serviceData.features || [],

            rating: serviceData.rating || {},

            verificationStatus: serviceData.verificationStatus,
            rank: serviceData.rank,
            isFeatured: serviceData.isFeatured,
          };

          break;

        // BIKE
        case "bike":
          serviceDetails = {
            serviceType: "bike",

            id: serviceData._id,
            name: serviceData.name,
            description: serviceData.description,

            location: serviceData.location || {},
            address: serviceData.address,

            coordinates: serviceData.coordinates || {},

            images: serviceData.images || [],
            documents: serviceData.documents || [],

            features: serviceData.features || [],

            rentalPolicies: serviceData.rentalPolicies || {},

            rating: serviceData.rating || {},

            verificationStatus: serviceData.verificationStatus,
            rank: serviceData.rank,
            isFeatured: serviceData.isFeatured,
          };

          break;

        // TOUR
        case "tour":
          serviceDetails = {
            serviceType: "tour",

            id: serviceData._id,
            name: serviceData.name,
            description: serviceData.description,

            location: serviceData.location || {},
            address: serviceData.address,

            coordinates: serviceData.coordinates || {},

            images: serviceData.images || [],
            documents: serviceData.documents || [],

            features: serviceData.features || [],
            tags: serviceData.tags || [],

            rating: serviceData.rating || {},

            verificationStatus: serviceData.verificationStatus,
            rank: serviceData.rank,
            isFeatured: serviceData.isFeatured,
          };

          break;

        // ADVENTURE
        case "adventure":
          serviceDetails = {
            serviceType: "adventure",

            id: serviceData._id,
            name: serviceData.name,
            description: serviceData.description,

            category: serviceData.category,

            location: serviceData.location || {},
            address: serviceData.address,

            coordinates: serviceData.coordinates || {},

            images: serviceData.images || [],
            documents: serviceData.documents || [],

            features: serviceData.features || [],

            priceRange: serviceData.priceRange || {},

            rating: serviceData.rating || {},

            verificationStatus: serviceData.verificationStatus,
            rank: serviceData.rank,
            isFeatured: serviceData.isFeatured,
          };

          break;

        default:
          serviceDetails = null;
      }
    }

    // BASE RESPONSE
    const response = {
      vendor: {
        vendorId: vendor._id,
        propertyId: vendor.propertyId || null,
        status: vendor.status,
        currentStep: vendor.currentStep,
        registrationStep: vendor.registrationStep,
        rejectedSteps: vendor.rejectedSteps || [],
        rejectionReasons: vendor.rejectionReasons || {},
        isSubmitted: vendor.isSubmitted,

        serviceType: vendor.serviceType,
      },

      businessDetails: {

        businessName: vendor.businessName,
        businessEmail: vendor.businessEmail,
        businessPhone: vendor.businessPhone,

        address: vendor.businessAddress,
        city: vendor.city,
        state: vendor.state,
        country: vendor.country,
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

            verificationStatus: bank.verificationStatus,
          }
        : null,

      serviceDetails,
    };

    // APPROVED DATA
    if (vendor.status === "approved") {
      response.approvedData = {
        vendorName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),

        vendorEmail: user.email,

        businessName: vendor.businessName,
        businessEmail: vendor.businessEmail,

        serviceType: vendor.serviceType,

        companyId: serviceData?._id || null,
        hotelId: serviceData?._id || null,
        cabId: serviceData?._id || null,
        bikeId: serviceData?._id || null,
        tourId: serviceData?._id || null,
        adventureId: serviceData?._id || null,
        serviceName: serviceData?.name || null,
      };
    }

    return response;
  } catch (error) {
    throw error;
  }
};

exports.createVendorProfile = async (userId, vendorData) => {
  try {
    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      throw new Error("Vendor not found. Please verify OTP first.");
    }

    if (vendor.isSubmitted && vendor.status !== "rejected") {
      throw new Error("Already submitted. Cannot edit.");
    }

    if (vendor.currentStep !== 1 && vendor.status !== "rejected") {
      throw new Error("Invalid step flow");
    }

    if (vendor.status === "rejected" && !vendor.rejectedSteps.includes(2)) {
      throw new Error("Fix required step first");
    }

    Object.assign(vendor, {
      serviceType: vendorData.serviceType,
      businessName: vendorData.businessName,
      businessEmail: vendorData.businessEmail,
      businessPhone: vendorData.businessPhone,
      businessAddress: vendorData.businessAddress,
      city: vendorData.city,
      state: vendorData.state,
      country: vendorData.country,
      panNumber: vendorData.panNumber,
      aadhaarNumber: vendorData.aadhaarNumber,
      verificationDocs: vendorData.verificationDocs,
    });

    //STEP UPDATE
    vendor.currentStep = 2;
    vendor.registrationStep = Math.max(vendor.registrationStep, 2);

    if (vendor.rejectedSteps?.includes(2)) {
      vendor.rejectedSteps = vendor.rejectedSteps.filter((s) => s !== 2);
    }

    if (vendor.rejectionReasons) {
      delete vendor.rejectionReasons["2"];
    }

    if (!vendor.rejectedSteps || vendor.rejectedSteps.length === 0) {
      vendor.status = "draft";
    }

    await vendor.save();

    return vendor;
  } catch (error) {
    logger.error("Service Error: createVendorProfile", error);
    throw error;
  }
};

exports.submitVendor = async (vendor) => {
  try {
    if (vendor.isSubmitted) {
      throw new Error("Already submitted");
    }

    //step incomplete
    if (vendor.currentStep !== 4) {
      throw new Error("Please complete all steps before submitting");
    }

    //pending issues
    if (vendor.rejectedSteps && vendor.rejectedSteps.length > 0) {
      throw new Error("Please fix all issues before submitting");
    }

    if (!vendor.serviceType || !vendor.businessName) {
      throw new Error("Incomplete vendor profile");
    }

    //final submit
    vendor.status = "pending";
    vendor.isSubmitted = true;
    vendor.submittedAt = new Date();

    await vendor.save();

    let hotel = null;
    if (vendor.serviceType === "hotel") {
      hotel = await Hotel.findOne({ vendorId: vendor._id });
    }
    //send email to admin and vendor
    Promise.all([
      sendAdminVendorNotificationEmail(vendor, hotel),
      sendVendorSubmissionConfirmationEmail(vendor),
    ]).catch((err) => {
      console.error("Email sending failed:", err.message);
    });

    return vendor;
  } catch (error) {
    logger.error("Service Error: submitVendor", error);
    throw error;
  }
};

// Get vendor profile by User ID
exports.getVendorByUserId = async (userId) => {
  try {
    return await Vendor.findOne({ userId }).lean();
  } catch (error) {
    logger.error("Service Error: getVendorByUserId", error);
    throw error;
  }
};
