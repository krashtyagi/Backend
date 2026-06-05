const express = require("express");
const router = express.Router();

const bookingController = require("./booking.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

//Get booking stats
router.get(
  "/stats",
  protect,
  authorize("admin"),
  bookingController.getBookingStats,
);

//Get all bookings
router.get("/", protect, authorize("admin"), bookingController.getAllBookings);

//Get booking detail
router.get(
  "/:bookingId",
  protect,
  authorize("admin"),
  bookingController.getBookingDetail,
);

module.exports = router;
