const express = require("express");
const router = express.Router();
const dashboardController = require("./dashboard.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

router.use(protect);

router.get(
  "/stats",
  protect,
  authorize("vendor"),
  dashboardController.getDashboardStats,
);

router.get(
  "/analytics",
  protect,
  authorize("vendor"),
  dashboardController.getDashboardAnalytics,
);

router.get(
  "/recent-bookings",
  protect,
  authorize("vendor"),
  dashboardController.getRecentBookings,
);

module.exports = router;
