import { Router } from "express";
import { BookingController } from "./booking.controller.js";
import { protect } from "../../../shared/middlewares/verifyToken.js";
import { authorize } from "../../../shared/middlewares/roleMiddleware.js";

const router = Router();
const bookingController = new BookingController();

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

export default router;
