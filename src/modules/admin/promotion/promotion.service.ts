import Promotion from "./promotion.model";
import Hotel from "../../hotels/hotel.model";
import CabCompany from "../../cab/company/cab.model";
import BikeCompany from "../../bike/company/bike.model";
import TourCompany from "../../tour/company/tour.model";
import Adventure from "../../adventure/category/adventure.model";
import logger from "../../../shared/utils/logger";

const SERVICE_MODELS: Record<string, any> = {
  hotel: Hotel,
  cab: CabCompany,
  bike: BikeCompany,
  tour: TourCompany,
  adventure: Adventure,
};

export const getAllPromotionRequests = async () => {
  try {
    const requests: any[] = await Promotion.find()
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

    const formatted = requests.map((req: any) => {
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

export const approvePromotion = async (promotionId: any, adminUserId: any, rank: any, startDate?: any, endDate?: any) => {
  try {
    const promotion: any = await Promotion.findById(promotionId);
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

export const assignPropertyPromotion = async ({
  vendorId,
  serviceType,
  serviceId,
  rank,
  startDate,
  endDate,
  adminUserId,
}: any) => {
  try {
    if (!["A", "B", "C"].includes(rank)) {
      throw new Error("Invalid rank. Must be A, B, or C");
    }

    let promotion: any = await Promotion.findOne({
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

export const updatePromotionRank = async (promotionId: any, rank: any) => {
  try {
    if (!["A", "B", "C"].includes(rank)) {
      throw new Error("Invalid rank value. Must be A, B, or C");
    }

    const promotion: any = await Promotion.findById(promotionId);
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

export const updatePromotionDuration = async (promotionId: any, startDate: any, endDate: any) => {
  try {
    const promotion: any = await Promotion.findById(promotionId);
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

export const removePromotion = async (promotionId: any) => {
  try {
    const promotion: any = await Promotion.findById(promotionId);
    if (!promotion) {
      throw new Error("Promotion not found");
    }

    const oldServiceId = promotion.serviceId;
    const oldServiceType = promotion.serviceType;

    // Mark as rejected / remove rank
    promotion.status = "rejected";
    promotion.rankAssigned = null as any;
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

export class PromotionService {
  getAllPromotionRequests = getAllPromotionRequests;
  approvePromotion = approvePromotion;
  assignPropertyPromotion = assignPropertyPromotion;
  updatePromotionRank = updatePromotionRank;
  updatePromotionDuration = updatePromotionDuration;
  removePromotion = removePromotion;
}

export const promotionService = new PromotionService();

const promotion_service = {
  getAllPromotionRequests,
  approvePromotion,
  assignPropertyPromotion,
  updatePromotionRank,
  updatePromotionDuration,
  removePromotion,
};

export default promotion_service;
