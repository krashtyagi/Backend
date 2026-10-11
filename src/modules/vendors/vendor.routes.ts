import { Router } from "express";
import { VendorController } from "./vendor.controller";
import { BookingController } from "../bookings/booking.controller";
import { HotelController } from "../hotels/hotel.controller";
import { TaskController } from "../task/task.controller";
import { protect } from "../../shared/middlewares/verifyToken";
import { authorize } from "../../shared/middlewares/roleMiddleware";

const router = Router();
const vendorController = new VendorController();
const bookingController = new BookingController();
const hotelController = new HotelController();
const taskController = new TaskController();

// Vendor profile
router.post(
  "/register",
  protect,
  authorize("vendor"),
  vendorController.createVendorProfile,
);

// vendor get me help for the prefilling data 
router.get("/me", protect, authorize("vendor"), vendorController.getVendorMe);

// Update vendor company logo / pfp
router.patch(
  "/logo",
  protect,
  authorize("vendor"),
  vendorController.updateVendorLogo,
);

// Update listing advertisement banner image
router.patch(
  "/advertisement-image",
  protect,
  authorize("vendor"),
  vendorController.updateAdvertisementImage,
);

// Property settings & location history
router.get(
  "/property-settings",
  protect,
  authorize("vendor"),
  vendorController.getPropertySettings,
);

router.patch(
  "/property-settings",
  protect,
  authorize("vendor"),
  vendorController.updatePropertySettings,
);

// Get vendor's my listings data
router.get(
  "/my-listing",
  protect,
  authorize("vendor"),
  vendorController.getVendorMyListing,
);

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

// invoice
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

// dashboard
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

// Promotions
router.post(
  "/promotions/apply",
  protect,
  authorize("vendor"),
  vendorController.applyForPromotion,
);

router.get(
  "/promotions/my-requests",
  protect,
  authorize("vendor"),
  vendorController.getMyPromotionRequests,
);

export default router;
