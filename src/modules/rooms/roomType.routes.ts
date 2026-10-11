import { Router } from "express";
import { RoomTypeController } from "./roomType.controller";
import { protect } from "../../shared/middlewares/verifyToken";
import { authorize } from "../../shared/middlewares/roleMiddleware";

const router = Router();
const controller = new RoomTypeController();

// Vendor
router.use(protect);
router.post("/", authorize("vendor"), controller.createRoomType);

router.post(
  "/auto",
  authorize("vendor"),
  controller.createRoomTypeWithAutoRooms,
);
router.patch("/:id", authorize("vendor"), controller.updateRoomType);
router.delete("/:id", authorize("vendor"), controller.deleteRoomType);

export default router;
