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

router.patch(
  "/:id/approve",
  protect,
  authorize("admin"),
  adminPromotionController.approvePromotion
);

module.exports = router;
