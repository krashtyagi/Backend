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
        startDate: req.startDate || req.approvedAt || req.createdAt,
        endDate: req.endDate || null,
        serviceType: req.serviceType,
        serviceId: req.serviceId,
        vendorId: vendor._id || req.vendorId,
        createdAt: req.createdAt,
        approvedAt: req.approvedAt,
      };
    });

    return formatted;
  } catch (error) {
    logger.error("Service Error: getAllPromotionRequests", error);
    throw error;
  }
};

exports.approvePromotion = async (promotionId, adminUserId, rank, startDate, endDate) => {
  try {
    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      throw new Error("Promotion request not found");
    }

    // Update promotion request
    promotion.status = "approved";
    promotion.rankAssigned = rank;
    promotion.approvedBy = adminUserId;
    promotion.approvedAt = new Date();
    if (startDate) promotion.startDate = new Date(startDate);
    if (endDate) promotion.endDate = new Date(endDate);
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

exports.assignPropertyPromotion = async ({
  vendorId,
  serviceType,
  serviceId,
  rank,
  startDate,
  endDate,
  adminUserId,
}) => {
  try {
    if (!["A", "B", "C"].includes(rank)) {
      throw new Error("Invalid rank. Must be A, B, or C");
    }

    let promotion = await Promotion.findOne({
      serviceId,
      status: { $in: ["approved", "pending"] },
    });

    if (promotion) {
      promotion.status = "approved";
      promotion.rankAssigned = rank;
      promotion.plan = promotion.plan || "Admin";
      promotion.startDate = startDate ? new Date(startDate) : new Date();
      promotion.endDate = endDate ? new Date(endDate) : null;
      promotion.approvedBy = adminUserId;
      promotion.approvedAt = new Date();
      await promotion.save();
    } else {
      promotion = await Promotion.create({
        vendorId,
        serviceType,
        serviceId,
        plan: "Admin",
        status: "approved",
        rankAssigned: rank,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        approvedBy: adminUserId,
        approvedAt: new Date(),
      });
    }

    // Dynamically update listing's rank in the business model
    const ServiceModel = SERVICE_MODELS[serviceType];
    if (ServiceModel && serviceId) {
      await ServiceModel.findByIdAndUpdate(serviceId, { rank });
    }

    return promotion;
  } catch (error) {
    logger.error("Service Error: assignPropertyPromotion", error);
    throw error;
  }
};

exports.updatePromotionRank = async (promotionId, rank) => {
  try {
    if (!["A", "B", "C"].includes(rank)) {
      throw new Error("Invalid rank value. Must be A, B, or C");
    }

    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      throw new Error("Promotion not found");
    }

    promotion.rankAssigned = rank;
    promotion.status = "approved";
    await promotion.save();

    const ServiceModel = SERVICE_MODELS[promotion.serviceType];
    if (ServiceModel && promotion.serviceId) {
      await ServiceModel.findByIdAndUpdate(promotion.serviceId, { rank });
    }

    return promotion;
  } catch (error) {
    logger.error("Service Error: updatePromotionRank", error);
    throw error;
  }
};

exports.updatePromotionDuration = async (promotionId, startDate, endDate) => {
  try {
    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      throw new Error("Promotion not found");
    }

    if (startDate) promotion.startDate = new Date(startDate);
    if (endDate !== undefined) {
      promotion.endDate = endDate ? new Date(endDate) : null;
    }
    await promotion.save();

    return promotion;
  } catch (error) {
    logger.error("Service Error: updatePromotionDuration", error);
    throw error;
  }
};

exports.removePromotion = async (promotionId) => {
  try {
    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      throw new Error("Promotion not found");
    }

    const oldServiceId = promotion.serviceId;
    const oldServiceType = promotion.serviceType;

    // Mark as rejected / remove rank
    promotion.status = "rejected";
    promotion.rankAssigned = null;
    await promotion.save();

    // Revert business model rank to default C
    const ServiceModel = SERVICE_MODELS[oldServiceType];
    if (ServiceModel && oldServiceId) {
      await ServiceModel.findByIdAndUpdate(oldServiceId, { rank: "C" });
    }

    return promotion;
  } catch (error) {
    logger.error("Service Error: removePromotion", error);
    throw error;
  }
};
