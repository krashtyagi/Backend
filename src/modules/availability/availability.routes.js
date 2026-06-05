const express = require("express");
const router = express.Router();
const controller = require("./availability.controller");
const { protect } = require("../../shared/middlewares/verifyToken");
const { authorize } = require("../../shared/middlewares/roleMiddleware");

// User side (check calendar)
router.get("/", controller.getAvailability);

// Vendor side (manage calendar)
router.use(protect);
router.post("/", authorize("vendor"), controller.setAvailability);


//vendor only routes...

//room type return route
router.get(
  "/:hotelId/room-types",
  protect,
  authorize("vendor"),
  controller.getVendorRoomTypes
);

//perticular room tpye availability calender return
router.get(
  "/:roomTypeId/calendar",
  protect,
  authorize("vendor"),
  controller.getRoomTypeCalendar
);

//date and price over-ride
router.patch(
  "/:roomTypeId/calendar",
  protect,
  authorize("vendor"),
  controller.updateRoomTypeCalendar
);

//over-ride price remove
router.delete(
  "/:roomTypeId/calendar",
  protect,
  authorize("vendor"),
  controller.resetRoomTypeCalendar
);

module.exports = router;
