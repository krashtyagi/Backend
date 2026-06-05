const express = require("express");
const router = express.Router();

const dashboardController = require("./dashboard.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

//dashboard stats with card
router.get(
  "/",
  protect,
  authorize("admin"),
  dashboardController.getDashboard
);

//Recent bookings
router.get(
  "/recent-bookings",
  protect,
  authorize("admin"),
  dashboardController.getRecentBookings
);

module.exports = router;