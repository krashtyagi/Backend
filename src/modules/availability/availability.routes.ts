import { Router } from "express";
import { AvailabilityController } from "./availability.controller";
import { protect } from "../../shared/middlewares/verifyToken";
import { authorize } from "../../shared/middlewares/roleMiddleware";

const router = Router();
const availabilityController = new AvailabilityController();

// User side (check calendar)
router.get("/", availabilityController.getAvailability);

// Vendor side (manage calendar)
router.use(protect);
router.post("/", authorize("vendor"), availabilityController.setAvailability);

//vendor only routes...

//room type return route
router.get(
  "/:hotelId/room-types",
  protect,
  authorize("vendor"),
  availabilityController.getVendorRoomTypes,
);

//perticular room tpye availability calender return
router.get(
  "/:roomTypeId/calendar",
  protect,
  authorize("vendor"),
  availabilityController.getRoomTypeCalendar,
);

//date and price over-ride
router.patch(
  "/:roomTypeId/calendar",
  protect,
  authorize("vendor"),
  availabilityController.updateRoomTypeCalendar,
);

//over-ride price remove
router.delete(
  "/:roomTypeId/calendar",
  protect,
  authorize("vendor"),
  availabilityController.resetRoomTypeCalendar,
);

export default router;
