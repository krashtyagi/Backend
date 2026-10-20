import { Router } from "express";
import { MultiServiceBookingController } from "./booking.controller.js";
import { optionalProtect } from "../../shared/middlewares/verifyToken.js";

const router = Router();
const bookingController = new MultiServiceBookingController();

// Guest-accessible routes (optionalProtect: attaches user if token present, else continues as guest)
router.post("/booking", optionalProtect, bookingController.createBooking);
router.post("/verify-payment", optionalProtect, bookingController.verifyPayment);

export default router;
