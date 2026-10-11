import { Router } from "express";
import { BookingController } from "./booking.controller";
import { protect } from "../../shared/middlewares/verifyToken";
import { authorize } from "../../shared/middlewares/roleMiddleware";

const router = Router();
const bookingController = new BookingController();

router.use(protect, authorize("user"));

router.post("/", bookingController.createBooking);
router.get("/my-bookings", bookingController.getMyBookings);

router.get("/my-bookings/:bookingId/download", bookingController.downloadMyInvoice);

router.patch("/:id/cancel", bookingController.cancelBooking);
router.get("/:id/refund-preview", bookingController.getRefundPreview);
router.get("/:id", bookingController.getBookingById);

export default router;
