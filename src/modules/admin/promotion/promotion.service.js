const Promotion = require("./promotion.model");
const Hotel = require("../../hotels/hotel.model");
const CabCompany = require("../../cab/company/cab.model");
const BikeCompany = require("../../bike/company/bike.model");
const TourCompany = require("../../tour/company/tour.model");
const Adventure = require("../../adventure/category/adventure.model");
const logger = require("../../../shared/utils/logger");

const SERVICE_MODELS = {
  hotel: Hotel,
  cab: CabCompany,
  bike: BikeCompany,
  tour: TourCompany,
  adventure: Adventure,
};

exports.getAllPromotionRequests = async () => {
  try {
    const requests = await Promotion.find()
      .populate({
        path: "vendorId",
        populate: {
          path: "userId",
          select: "firstName lastName email",
        },
        select: "businessName businessEmail businessPhone businessAddress city state status userId propertyId",
      })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = requests.map((req) => {
      const vendor = req.vendorId || {};
      const user = vendor.userId || {};
      return {
        id: req._id,
        vendorName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        vendorEmail: user.email || "",
        propertyId: vendor.propertyId || "",
        companyName: vendor.businessName || "",
        area: `${vendor.city || ""}, ${vendor.state || ""}`.trim().replace(/^,|,$/g, "") || vendor.businessAddress || "",
        phoneNumber: vendor.businessPhone || "",
        email: vendor.businessEmail || "",
        plan: req.plan,
        status: req.status,
        rankAssigned: req.rankAssigned,
        serviceType: req.serviceType,
        serviceId: req.serviceId,
        createdAt: req.createdAt,
      };
    });

    return formatted;
  } catch (error) {
    logger.error("Service Error: getAllPromotionRequests", error);
    throw error;
  }
};

exports.approvePromotion = async (promotionId, adminUserId, rank) => {
  try {
    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      throw new Error("Promotion request not found");
    }

    if (promotion.status === "approved") {
      throw new Error("Promotion request is already approved");
    }

    // Update promotion request
    promotion.status = "approved";
    promotion.rankAssigned = rank;
    promotion.approvedBy = adminUserId;
    promotion.approvedAt = new Date();
    await promotion.save();

    // Dynamically update listing's rank
    const ServiceModel = SERVICE_MODELS[promotion.serviceType];
    if (ServiceModel) {
      await ServiceModel.findByIdAndUpdate(promotion.serviceId, { rank: rank });
    }

    return promotion;
  } catch (error) {
    logger.error("Service Error: approvePromotion", error);
    throw error;
  }
};
