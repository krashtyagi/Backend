import { Router } from "express";
import { MultiServiceBookingController } from "./booking.controller.js";
import { protect } from "../../shared/middlewares/verifyToken.js";
import { authorize } from "../../shared/middlewares/roleMiddleware.js";

const router = Router();
const bookingController = new MultiServiceBookingController();

router.use(protect);

router.post("/booking", authorize("user"), bookingController.createBooking);

router.post(
  "/verify-payment",
  authorize("user"),
  bookingController.verifyPayment,
);

export default router;
