import { Router } from "express";
import { RoomTypeController } from "./roomType.controller.js";
import { protect } from "../../shared/middlewares/verifyToken.js";
import { authorize } from "../../shared/middlewares/roleMiddleware.js";

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
