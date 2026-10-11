import { Router } from "express";
import { MSVBookingController } from "./booking.controller";
import { protect } from "../../../shared/middlewares/verifyToken";
import { authorize } from "../../../shared/middlewares/roleMiddleware";

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
