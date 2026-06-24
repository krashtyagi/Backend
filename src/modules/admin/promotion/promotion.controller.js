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
    const { rank } = req.body;
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

    const data = await adminPromotionService.approvePromotion(id, adminUserId, rank);

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
