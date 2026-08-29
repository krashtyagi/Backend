const Vendor = require("./vendor.model");
const VendorBank = require("../vendorBank/bank.model");
const User = require("../../modules/auth/auth.model");

const Hotel = require("../hotels/hotel.model");
const CabCompany = require("../cab/company/cab.model");
const BikeCompany = require("../bike/company/bike.model");
const TourCompany = require("../tour/company/tour.model");
const Adventure = require("../adventure/category/adventure.model");

const RoomType = require("../rooms/roomType.model");
const CabService = require("../cab/service/cabService.model");
const BikeService = require("../bike/service/bikeService.model");
const AdventureService = require("../adventure/service/service.model");
const TourService = require("../tour/service/tourService.model");
const Promotion = require("../admin/promotion/promotion.model");

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
        logo: vendor.logo?.url || (typeof vendor.logo === "string" ? vendor.logo : user.avatar || null),
        serviceType: vendor.serviceType,
      },

      businessDetails: {
        businessName: vendor.businessName,
        businessEmail: vendor.businessEmail,
        businessPhone: vendor.businessPhone,
        logo: vendor.logo?.url || (typeof vendor.logo === "string" ? vendor.logo : user.avatar || null),
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

        propertyId: vendor.propertyId || null,

        businessName: vendor.businessName,
        businessEmail: vendor.businessEmail,
        logo: vendor.logo?.url || (typeof vendor.logo === "string" ? vendor.logo : user.avatar || null),

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

// Get vendor's my listing data with services and subservices
exports.getVendorMyListing = async (userId) => {
  try {
    // 1. Get User
    const user = await User.findById(userId).select("firstName lastName email");
    if (!user) {
      throw new Error("User not found");
    }

    // 2. Get Vendor
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
      throw new Error("Vendor not found");
    }

    // 3. Get Bank details
    const bank = await VendorBank.findOne({
      vendorId: vendor._id,
      isActive: true,
    }).select("+accountNumber +ifscCode +upiId");

    // 4. Get main service data
    const ServiceModel = SERVICE_MODELS[vendor.serviceType];
    let serviceData = null;
    if (ServiceModel) {
      serviceData = await ServiceModel.findOne({
        vendorId: vendor._id,
        isActive: true,
      });
    }

    // 5. Get subservices based on serviceType
    let subServices = [];
    if (serviceData) {
      switch (vendor.serviceType) {
        case "hotel":
          const roomTypes = await RoomType.find({
            hotelId: serviceData._id,
            isActive: true,
          }).select("name basePrice discountPrice capacity isActive");
          subServices = roomTypes.map((rt) => ({
            id: rt._id,
            name: rt.name,
            basePrice: rt.basePrice,
            discountPrice: rt.discountPrice,
            capacity: rt.capacity,
            isActive: rt.isActive,
          }));
          break;

        case "cab":
          const cabServices = await CabService.find({
            cab: serviceData._id,
            isActive: true,
          }).select("title carName cabType capacity basePrice isActive");
          subServices = cabServices.map((cs) => ({
            id: cs._id,
            name: cs.title,
            carName: cs.carName,
            cabType: cs.cabType,
            capacity: cs.capacity,
            basePrice: cs.basePrice,
            isActive: cs.isActive,
          }));
          break;

        case "bike":
          const bikeServices = await BikeService.find({
            bike: serviceData._id,
            isActive: true,
          }).select("title bikeName bikeType pricePerDay isActive");
          subServices = bikeServices.map((bs) => ({
            id: bs._id,
            name: bs.title,
            bikeName: bs.bikeName,
            bikeType: bs.bikeType,
            pricePerDay: bs.pricePerDay,
            isActive: bs.isActive,
          }));
          break;

        case "adventure":
          const adventureServices = await AdventureService.find({
            adventure: serviceData._id,
            isActive: true,
          }).select("title type basePrice isActive");
          subServices = adventureServices.map((as) => ({
            id: as._id,
            name: as.title,
            type: as.type,
            basePrice: as.basePrice,
            isActive: as.isActive,
          }));
          break;

        case "tour":
          const tourServices = await TourService.find({
            tour: serviceData._id,
            isActive: true,
          }).select("title duration basePrice isActive");
          subServices = tourServices.map((ts) => ({
            id: ts._id,
            name: ts.title,
            duration: ts.duration,
            basePrice: ts.basePrice,
            isActive: ts.isActive,
          }));
          break;

        default:
          subServices = [];
      }
    }

    return {
      vendor: {
        vendorId: vendor._id,
        propertyId: vendor.propertyId || null,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.email,
        businessName: vendor.businessName,
        serviceType: vendor.serviceType,
        status: vendor.status,
      },
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
      serviceDetails: serviceData
        ? {
            id: serviceData._id,
            name: serviceData.name,
            description: serviceData.description,
            address: serviceData.address,
            city: serviceData.city || (serviceData.location ? serviceData.location.city : null),
            rating: typeof serviceData.rating === "number"
              ? serviceData.rating
              : (serviceData.rating ? serviceData.rating.average : 0),
            verificationStatus: serviceData.verificationStatus,
            isActive: serviceData.isActive,
          }
        : null,
      subServices,
    };
  } catch (error) {
    logger.error("Service Error: getVendorMyListing", error);
    throw error;
  }
};

exports.applyForPromotion = async (userId, plan) => {
  try {
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    if (vendor.status !== "approved") {
      throw new Error("Only approved vendors can apply for promotion");
    }

    // Find the vendor's active service listing
    const ServiceModel = SERVICE_MODELS[vendor.serviceType];
    if (!ServiceModel) {
      throw new Error("Invalid vendor service type");
    }

    const serviceData = await ServiceModel.findOne({
      vendorId: vendor._id,
      isActive: true,
    });

    if (!serviceData) {
      throw new Error("No active listing found to promote");
    }

    // Check for existing pending promotion request
    const existingPending = await Promotion.findOne({
      vendorId: vendor._id,
      serviceId: serviceData._id,
      status: "pending",
    });

    if (existingPending) {
      throw new Error("You already have a pending promotion request under review");
    }

    // Check if they already have an active promotion of this exact plan
    const existingApproved = await Promotion.findOne({
      vendorId: vendor._id,
      serviceId: serviceData._id,
      plan: plan,
      status: "approved",
    });

    if (existingApproved) {
      throw new Error(`This listing is already active on the ${plan} plan`);
    }

    const promotion = await Promotion.create({
      vendorId: vendor._id,
      serviceType: vendor.serviceType,
      serviceId: serviceData._id,
      plan: plan,
      status: "pending",
    });

    return promotion;
  } catch (error) {
    logger.error("Service Error: applyForPromotion", error);
    throw error;
  }
};

exports.getMyPromotionRequests = async (userId) => {
  try {
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const requests = await Promotion.find({ vendorId: vendor._id })
      .sort({ createdAt: -1 })
      .lean();

    return requests;
  } catch (error) {
    logger.error("Service Error: getMyPromotionRequests", error);
    throw error;
  }
};
