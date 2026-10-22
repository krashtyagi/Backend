import "dotenv/config";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import passport from "passport";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import hotelRoutes from "./modules/hotels/hotel.routes.js";
import roomRoutes from "./modules/rooms/room.routes.js";

import roomTypeRoutes from "./modules/rooms/roomType.routes.js";
import availabilityRoutes from "./modules/availability/availability.routes.js";
import vendorRoutes from "./modules/vendors/vendor.routes.js";
import policyRoutes from "./modules/policies/policy.routes.js";
import bookingRoutes from "./modules/bookings/booking.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import reviewRoutes from "./modules/reviews/review.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";
import favoriteRoutes from "./modules/favorites/favorite.routes.js";
import vendorBankRoutes from "./modules/vendorBank/bank.routes.js";
import supportRoutes from "./modules/support/support.routes.js";

import adventureRoutes from "./modules/adventure/category/adventure.routes.js";
import serviceRoutes from "./modules/adventure/service/service.routes.js";
import cabRoutes from "./modules/cab/company/cab.routes.js";
import cabServiceRoutes from "./modules/cab/service/cabService.routes.js";
import bikeRoutes from "./modules/bike/company/bike.routes.js";
import bikeServiceRoutes from "./modules/bike/service/bikeService.routes.js";
import tourRoutes from "./modules/tour/company/tour.routes.js";
import tourServiceRoutes from "./modules/tour/service/tourService.routes.js";

import multiServiceBookingRoutes from "./modules/multiServiceBookings/booking.routes.js";
import multiServiceVendorRoutes from "./modules/multiServiceVendor/vendor.routes.js";

import vendorAccountRoutes from "./modules/vendorAccountGroup/accountGroup.routes.js";
import vendorPropertyRoutes from "./modules/vendorProperty/property.routes.js";

import adminRoutes from "./modules/admin/property/property.routes.js";
import adminUserRoutes from "./modules/admin/user/user.routes.js";
import adminBookingRoutes from "./modules/admin/booking/booking.routes.js";
import adminReviewRoutes from "./modules/admin/review/review.routes.js";
import adminPaymentRoutes from "./modules/admin/payment/payment.routes.js";
import adminSupportRoutes from "./modules/admin/support/support.routes.js";
import adminDashboardRoutes from "./modules/admin/dashboard/dashboard.routes.js";
import adminTaxRoutes from "./modules/admin/tax/tax.routes.js";
import adminAccountDeactivateRoutes from "./modules/admin/account-deactivate/account.routes.js";
import adminPromotionRoutes from "./modules/admin/promotion/promotion.routes.js";
import adminVendorPropertyRoutes from "./modules/admin/vendorProperty/vendorProperty.routes.js";
import { errorHandler } from "./shared/middlewares/errorHandler.js";
import "./shared/config/passport.js";

const app: Application = express();

// ── Allowed origins for CORS ──
const allowedOrigins: string[] = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  process.env.FRONTEND_URL,
  process.env.VENDOR_URL,
  process.env.ADMIN_URL,
].filter(Boolean) as string[];

function isOriginAllowed(origin: string): boolean {
  if (allowedOrigins.includes(origin)) return true;

  // Allow production & preview domains for trivllo / helix
  if (
    origin === "https://trivllo.com" ||
    origin.endsWith(".trivllo.com") ||
    origin.includes("helix-fawn.vercel.app") ||
    /^https:\/\/.*trivll?o.*\.vercel\.app$/.test(origin)
  ) {
    return true;
  }

  return false;
}

// ── CORS must be registered BEFORE helmet so preflight (OPTIONS) requests
//    are handled before helmet can set restrictive headers ──
app.use(
  cors({
    origin: function (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) {
      // Non-browser or server-to-server requests without Origin header
      if (!origin) return callback(null, true);

      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }

      const corsError: any = new Error(`CORS blocked: Origin ${origin} is not allowed`);
      corsError.statusCode = 403;
      return callback(corsError);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Cache-Control",
      "X-CSRF-Token",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400, // Cache preflight response for 24 hours
  }),
);

// ── Helmet AFTER cors – configure to not conflict with cross-origin requests ──
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
    crossOriginEmbedderPolicy: false,
  }),
);

// ── Block direct browser address-bar navigation to /api endpoints ──
app.use("/api", (req: Request, res: Response, next: NextFunction) => {
  // Allow OAuth redirects through browser navigation
  if (
    req.originalUrl.includes("/auth/google") ||
    req.originalUrl.includes("/auth/facebook") ||
    req.originalUrl.includes("/auth/apple")
  ) {
    return next();
  }

  const fetchDest = req.headers["sec-fetch-dest"];
  const fetchMode = req.headers["sec-fetch-mode"];

  // When a user types the URL in browser or opens it directly in a new tab
  if (fetchDest === "document" || fetchMode === "navigate") {
    return res.status(403).json({
      success: false,
      message: "Direct browser access to API endpoints is restricted.",
    });
  }

  next();
});

// Rate limiting..
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000, // Reasonable limit for busy single-page apps
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

app.get("/", (_req: Request, res: Response) =>
  res.status(200).send("Backend is running..."),
);

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
app.use("/api/v1/vendor-bank", vendorBankRoutes);
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

//vendor property management (multi-property)
app.use("/api/v1/vendor-properties", vendorPropertyRoutes);

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
app.use("/api/v1/admin/promotions", adminPromotionRoutes);
app.use("/api/v1/admin/vendor-properties", adminVendorPropertyRoutes);

app.use(errorHandler);

export default app;
