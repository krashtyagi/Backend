import { Router } from "express";
import { BookingController } from "./booking.controller.js";
import { protect, optionalProtect } from "../../shared/middlewares/verifyToken.js";
import { authorize } from "../../shared/middlewares/roleMiddleware.js";

const router = Router();
const bookingController = new BookingController();

// Guest-accessible route (optionalProtect: attaches user if token present, else continues as guest)
router.post("/", optionalProtect, bookingController.createBooking);

// Auth-required routes
router.get("/my-bookings", protect, authorize("user"), bookingController.getMyBookings);
router.get("/my-bookings/:bookingId/download", optionalProtect, bookingController.downloadMyInvoice);
router.patch("/:id/cancel", protect, authorize("user"), bookingController.cancelBooking);
router.get("/:id/refund-preview", protect, authorize("user"), bookingController.getRefundPreview);
router.get("/:id", protect, authorize("user"), bookingController.getBookingById);

export default router;
