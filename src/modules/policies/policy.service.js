const Policy = require("./policy.model");
const logger = require("../../shared/utils/logger");

//Create or Update Hotel Policy
exports.upsertPolicy = async (hotelId, data) => {
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

//Get hotel policy
exports.getPolicyByHotel = async (hotelId) => {
  try {
    const policy = await Policy.findOne({ hotelId }).lean();
    return policy || {};
  } catch (error) {
    logger.error("Service Error: getPolicyByHotel", error);
    throw error;
  }
};
