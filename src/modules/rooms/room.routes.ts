import { Router } from "express";
import { RoomController } from "./room.controller.js";
import { protect } from "../../shared/middlewares/verifyToken.js";
import { authorize } from "../../shared/middlewares/roleMiddleware.js";

const router = Router();
const roomController = new RoomController();

// Vendor only
router.use(protect);
router.post("/", authorize("vendor"), roomController.createRoom);
router.get(
  "/hotel/:hotelId",
  authorize("vendor"),
  roomController.getRoomsByHotel,
);
router.patch("/:id", authorize("vendor"), roomController.updateRoomStatus);

export default router;
