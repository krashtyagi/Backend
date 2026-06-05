const express = require("express");
const router = express.Router();
const vendorController = require("./vendor.controller");
const bookingController = require("../bookings/booking.controller");
const hotelController = require("../hotels/hotel.controller");
const taskController = require("../task/task.controller");
const { protect } = require("../../shared/middlewares/verifyToken");
const { authorize } = require("../../shared/middlewares/roleMiddleware");

// Vendor profile
router.post(
  "/register",
  protect,
  authorize("vendor"),
  vendorController.createVendorProfile,
);

//vendor get me help for the prefilling data 
router.get("/me", protect, authorize("vendor"), vendorController.getVendorMe);

// Bookings
router.get(
  "/bookings",
  protect,
  authorize("vendor"),
  vendorController.getVendorBookings,
);

router.get(
  "/bookings/:id",
  protect,
  authorize("vendor"),
  vendorController.getVendorBookingDetail,
);

router.patch(
  "/bookings/:id/refund",
  protect,
  authorize("admin"),
  bookingController.handleRefund,
);

// Room Types
router.get(
  "/room-types",
  protect,
  authorize("vendor"),
  vendorController.getVendorRoomTypes,
);

router.get(
  "/room-types/:id",
  protect,
  authorize("vendor"),
  vendorController.getVendorRoomTypeDetail,
);

// Hotels Create
router.post(
  "/hotels",
  protect,
  authorize("vendor"),
  hotelController.createHotel,
);

router.post(
  "/submit",
  protect,
  authorize("vendor"),
  vendorController.submitVendor,
);

router.patch(
  "/hotels/:id",
  protect,
  authorize("vendor"),
  hotelController.updateHotel,
);

//invoice
router.get(
  "/invoices",
  protect,
  authorize("vendor"),
  vendorController.getVendorInvoices,
);

router.get(
  "/invoices/:bookingId/download",
  protect,
  authorize("vendor"),
  vendorController.downloadInvoicePdf,
);

//dashboard
router.get(
  "/dashboard",
  protect,
  authorize("vendor"),
  vendorController.getVendorDashboard,
);

router.patch(
  "/bookings/:id/check-in",
  protect,
  authorize("vendor"),
  vendorController.checkInBooking,
);

router.patch(
  "/bookings/:id/staying",
  protect,
  authorize("vendor"),
  vendorController.markBookingStaying,
);

router.patch(
  "/bookings/:id/check-out",
  protect,
  authorize("vendor"),
  vendorController.checkOutBooking,
);

router.get("/tasks", protect, authorize("vendor"), taskController.getTasks);

router.post("/tasks", protect, authorize("vendor"), taskController.createTask);

router.patch(
  "/tasks/:id",
  protect,
  authorize("vendor"),
  taskController.updateTask,
);

router.delete(
  "/tasks/:id",
  protect,
  authorize("vendor"),
  taskController.deleteTask,
);

module.exports = router;
