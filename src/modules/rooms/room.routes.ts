import { Router } from "express";
import { RoomController } from "./room.controller";
import { protect } from "../../shared/middlewares/verifyToken";
import { authorize } from "../../shared/middlewares/roleMiddleware";

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
