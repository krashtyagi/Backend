const express = require("express");
const router = express.Router();
const controller = require("./booking.controller");
const { protect } = require("../../shared/middlewares/verifyToken");
const { authorize } = require("../../shared/middlewares/roleMiddleware");

router.use(protect, authorize("user"));

router.post("/", controller.createBooking);
router.get("/my-bookings", controller.getMyBookings);

router.get("/my-bookings/:bookingId/download", controller.downloadMyInvoice);

router.patch("/:id/cancel", controller.cancelBooking);
router.get("/:id/refund-preview", controller.getRefundPreview);
router.get("/:id", controller.getBookingById);

module.exports = router;
