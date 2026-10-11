import Policy from "./policy.model";
import logger from "../../shared/utils/logger";

// Create or Update Hotel Policy
export const upsertPolicy = async (hotelId: any, data: any) => {
  try {
    return await Policy.findOneAndUpdate(
      { hotelId },
      { $set: data },
      { new: true, upsert: true, runValidators: true },
    );
  } catch (error) {
    logger.error("Service Error: upsertPolicy", error);
    throw error;
  }
};

// Get hotel policy
export const getPolicyByHotel = async (hotelId: any) => {
  try {
    const policy = await Policy.findOne({ hotelId }).lean();
    return policy || {};
  } catch (error) {
    logger.error("Service Error: getPolicyByHotel", error);
    throw error;
  }
};

export class PolicyService {
  async upsertPolicy(hotelId: any, data: any) {
    return upsertPolicy(hotelId, data);
  }

  async getPolicyByHotel(hotelId: any) {
    return getPolicyByHotel(hotelId);
  }
}

export const policyService = new PolicyService();

export default policyService;

