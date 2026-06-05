const express = require("express");
const router = express.Router();

const paymentController = require("./payment.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

// Get payment stats
router.get(
  "/stats",
  protect,
  authorize("admin"),
  paymentController.getPaymentStats,
);

// Get payment analytics (charts)
router.get(
  "/analytics",
  protect,
  authorize("admin"),
  paymentController.getPaymentAnalytics,
);

// Get all payments
router.get("/", protect, authorize("admin"), paymentController.getAllPayments);

// Get refund requests
router.get(
  "/refunds",
  protect,
  authorize("admin"),
  paymentController.getRefundRequests,
);

// Approve / Reject refund
router.patch(
  "/:paymentId/refund",
  protect,
  authorize("admin"),
  paymentController.handleRefund,
);

//get detail page
router.get(
  "/:paymentId",
  protect,
  authorize("admin"),
  paymentController.getPaymentDetail,
);

module.exports = router;
