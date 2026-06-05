const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const passport = require("passport");

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const hotelRoutes = require("./modules/hotels/hotel.routes");
const roomRoutes = require("./modules/rooms/room.routes");
const roomTypeRoutes = require("./modules/rooms/roomType.routes");
const availabilityRoutes = require("./modules/availability/availability.routes");
const vendorRoutes = require("./modules/vendors/vendor.routes");
const policyRoutes = require("./modules/policies/policy.routes");
const bookingRoutes = require("./modules/bookings/booking.routes");
const paymentRoutes = require("./modules/payments/payment.routes");
const reviewRoutes = require("./modules/reviews/review.routes");
const uploadRoutes = require("./modules/upload/upload.routes");
const favoriteRoutes = require("./modules/favorites/favorite.routes");
const vendorBank = require("./modules/vendorBank/bank.routes");
const supportRoutes = require("./modules/support/support.routes");

const adventureRoutes = require("./modules/adventure/category/adventure.routes");
const serviceRoutes = require("./modules/adventure/service/service.routes");
const cabRoutes = require("./modules/cab/company/cab.routes");
const cabServiceRoutes = require("./modules/cab/service/cabService.routes");
const bikeRoutes = require("./modules/bike/company/bike.routes");
const bikeServiceRoutes = require("./modules/bike/service/bikeService.routes");
const tourRoutes = require("./modules/tour/company/tour.routes");
const tourServiceRoutes = require("./modules/tour/service/tourService.routes");

const multiServiceBookingRoutes = require("./modules/multiServiceBookings/booking.routes");
const multiServiceVendorRoutes = require("./modules/multiServiceVendor/vendor.routes");

const vendorAccountRoutes = require("./modules/vendorAccountGroup/accountGroup.routes");

const adminRoutes = require("./modules/admin/property/property.routes");
const adminUserRoutes = require("./modules/admin/user/user.routes");
const adminBookingRoutes = require("./modules/admin/booking/booking.routes");
const adminReviewRoutes = require("./modules/admin/review/review.routes");
const adminPaymentRoutes = require("./modules/admin/payment/payment.routes");
const adminSupportRoutes = require("./modules/admin/support/support.routes");
const adminDashboardRoutes = require("./modules/admin/dashboard/dashboard.routes");
const adminTaxRoutes = require("./modules/admin/tax/tax.routes");
const adminAccountDeactivateRoutes = require("./modules/admin/account-deactivate/account.routes");
const { errorHandler } = require("./shared/middlewares/errorHandler");
require("./shared/config/passport");

const app = express();

app.use(helmet());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  process.env.FRONTEND_URL,
  process.env.VENDOR_URL,
  process.env.ADMIN_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Rate limiting..
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

app.use(passport.initialize());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => res.status(200).send("Backend is running..."));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/hotels", hotelRoutes);
app.use("/api/v1/rooms", roomRoutes);
app.use("/api/v1/room-types", roomTypeRoutes);
app.use("/api/v1/availability", availabilityRoutes);
app.use("/api/v1/vendors", vendorRoutes);
app.use("/api/v1/policies", policyRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/uploads", uploadRoutes);
app.use("/api/v1/favorites", favoriteRoutes);
app.use("/api/v1/vendor-bank", vendorBank);
app.use("/api/v1/supports", supportRoutes);

//adventure
app.use("/api/v1/adventures", adventureRoutes);
app.use("/api/v1/services", serviceRoutes);

//cab
app.use("/api/v1/cabs", cabRoutes);
app.use("/api/v1/cab-services", cabServiceRoutes);

//bike
app.use("/api/v1/bikes", bikeRoutes);
app.use("/api/v1/bike-services", bikeServiceRoutes);

//tour
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/tour-services", tourServiceRoutes);

//generic booking
app.use("/api/v1/service-bookings", multiServiceBookingRoutes);

//multi-service vendor dashboard
app.use("/api/v1/multi-service-vendor", multiServiceVendorRoutes);

//multi-service vendor accounts linked
app.use("/api/v1/vendor-accounts", vendorAccountRoutes);
//admin
app.use("/api/v1/admin/dashboard", adminDashboardRoutes);
app.use("/api/v1/admin/property", adminRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);
app.use("/api/v1/admin/bookings", adminBookingRoutes);
app.use("/api/v1/admin/reviews", adminReviewRoutes);
app.use("/api/v1/admin/payments", adminPaymentRoutes);
app.use("/api/v1/admin/supports", adminSupportRoutes);
app.use("/api/v1/admin/tax", adminTaxRoutes);
app.use("/api/v1/admin/account-deactivate", adminAccountDeactivateRoutes);

app.use(errorHandler);

module.exports = app;
