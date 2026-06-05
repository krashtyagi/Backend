const express = require("express");
const router = express.Router();
const controller = require("./roomType.controller");
const { protect } = require("../../shared/middlewares/verifyToken");
const { authorize } = require("../../shared/middlewares/roleMiddleware");

// Vendor
router.use(protect);
router.post("/", authorize("vendor"), controller.createRoomType);

router.post(
  "/auto",
  authorize("vendor"),
  controller.createRoomTypeWithAutoRooms
);
router.patch("/:id", authorize("vendor"), controller.updateRoomType);
router.delete("/:id", authorize("vendor"), controller.deleteRoomType);

module.exports = router;
