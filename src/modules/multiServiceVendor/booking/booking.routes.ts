import { Router } from "express";
import { MSVBookingController } from "./booking.controller.js";
import { protect } from "../../../shared/middlewares/verifyToken.js";
import { authorize } from "../../../shared/middlewares/roleMiddleware.js";

const router = Router();
const bookingController = new MSVBookingController();

router.use(protect);

router.get(
  "/",
  protect,
  authorize("vendor"),
  bookingController.getVendorBookings,
);

router.get(
  "/:id",
  protect,
  authorize("vendor"),
  bookingController.getVendorBookingById,
);

export default router;
