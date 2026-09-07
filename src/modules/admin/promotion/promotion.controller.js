const adminPromotionService = require("./promotion.service");
const logger = require("../../../shared/utils/logger");

exports.getAllPromotionRequests = async (req, res, next) => {
  try {
    const data = await adminPromotionService.getAllPromotionRequests();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getAllPromotionRequests", error);
    next(error);
  }
};

exports.approvePromotion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rank, startDate, endDate } = req.body;
    const adminUserId = req.user._id;

    if (!rank) {
      return res.status(400).json({
        success: false,
        message: "Rank is required",
      });
    }

    const validRanks = ["A", "B", "C"];
    if (!validRanks.includes(rank)) {
      return res.status(400).json({
        success: false,
        message: "Invalid rank. Choose between A, B, or C",
      });
    }

    const data = await adminPromotionService.approvePromotion(
      id,
      adminUserId,
      rank,
      startDate,
      endDate
    );

    res.status(200).json({
      success: true,
      message: "Promotion approved and rank assigned successfully",
      data,
    });
  } catch (error) {
    logger.error("Controller Error: approvePromotion", error);
    next(error);
  }
};

exports.assignPropertyPromotion = async (req, res, next) => {
  try {
    const { vendorId, serviceType, serviceId, rank, startDate, endDate } = req.body;
    const adminUserId = req.user._id;

    if (!vendorId || !serviceType || !serviceId || !rank) {
      return res.status(400).json({
        success: false,
        message: "vendorId, serviceType, serviceId, and rank are required",
      });
    }

    const data = await adminPromotionService.assignPropertyPromotion({
      vendorId,
      serviceType,
      serviceId,
      rank,
      startDate,
      endDate,
      adminUserId,
    });

    res.status(200).json({
      success: true,
      message: `Property promoted with Rank ${rank} successfully`,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: assignPropertyPromotion", error);
    next(error);
  }
};

exports.updatePromotionRank = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rank } = req.body;

    if (!rank || !["A", "B", "C"].includes(rank)) {
      return res.status(400).json({
        success: false,
        message: "Valid rank (A, B, or C) is required",
      });
    }

    const data = await adminPromotionService.updatePromotionRank(id, rank);

    res.status(200).json({
      success: true,
      message: `Promotion rank updated to ${rank}`,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: updatePromotionRank", error);
    next(error);
  }
};

exports.updatePromotionDuration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;

    const data = await adminPromotionService.updatePromotionDuration(id, startDate, endDate);

    res.status(200).json({
      success: true,
      message: "Promotion duration updated successfully",
      data,
    });
  } catch (error) {
    logger.error("Controller Error: updatePromotionDuration", error);
    next(error);
  }
};

exports.removePromotion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await adminPromotionService.removePromotion(id);

    res.status(200).json({
      success: true,
      message: "Promotion and rank removed successfully",
      data,
    });
  } catch (error) {
    logger.error("Controller Error: removePromotion", error);
    next(error);
  }
};
