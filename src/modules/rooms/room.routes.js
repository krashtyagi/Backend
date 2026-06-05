const express = require("express");
const router = express.Router();
const roomController = require("./room.controller");
const { protect } = require("../../shared/middlewares/verifyToken");
const { authorize } = require("../../shared/middlewares/roleMiddleware");

// Vendor only
router.use(protect);
router.post("/", authorize("vendor"), roomController.createRoom);////////////////////////////
router.get(
  "/hotel/:hotelId",
  authorize("vendor"),
  roomController.getRoomsByHotel,
);
router.patch("/:id", authorize("vendor"), roomController.updateRoomStatus);

module.exports = router;
