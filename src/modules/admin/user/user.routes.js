const express = require("express");
const router = express.Router();

const userController = require("./user.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

// GET all users (admin)
router.get(
  "/",
  protect,
  authorize("admin"),
  userController.getAllUsers
);

//Get user booking history list
router.get(
  "/:userId/bookings",
  protect,
  authorize("admin"),
  userController.getUserBookings
);

//booking detail page
router.get(
  "/:userId/bookings/:bookingId",
  protect,
  authorize("admin"),
  userController.getBookingDetail
);

// Block / Unblock user
router.patch(
  "/:userId/status",
  protect,
  authorize("admin"),
  userController.updateUserStatus
);

module.exports = router;