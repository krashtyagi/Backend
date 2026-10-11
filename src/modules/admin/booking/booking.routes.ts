import { Router } from "express";
import { BookingController } from "./booking.controller";
import { protect } from "src/shared/middlewares/verifyToken";
import { authorize } from "src/shared/middlewares/roleMiddleware";

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
