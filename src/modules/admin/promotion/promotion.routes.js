const express = require("express");
const router = express.Router();
const adminPromotionController = require("./promotion.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

router.get(
  "/",
  protect,
  authorize("admin"),
  adminPromotionController.getAllPromotionRequests
);

router.post(
  "/assign",
  protect,
  authorize("admin"),
  adminPromotionController.assignPropertyPromotion
);

router.patch(
  "/:id/approve",
  protect,
  authorize("admin"),
  adminPromotionController.approvePromotion
);

router.patch(
  "/:id/rank",
  protect,
  authorize("admin"),
  adminPromotionController.updatePromotionRank
);

router.patch(
  "/:id/duration",
  protect,
  authorize("admin"),
  adminPromotionController.updatePromotionDuration
);

router.patch(
  "/:id/remove",
  protect,
  authorize("admin"),
  adminPromotionController.removePromotion
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  adminPromotionController.removePromotion
);

module.exports = router;
