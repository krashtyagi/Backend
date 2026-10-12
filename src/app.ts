import "dotenv/config";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import passport from "passport";
import { RPCHandler } from "@orpc/server/node";
import { appRouter } from "./rpc/router";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import hotelRoutes from "./modules/hotels/hotel.routes";
import roomRoutes from "./modules/rooms/room.routes";
import roomTypeRoutes from "./modules/rooms/roomType.routes";
import availabilityRoutes from "./modules/availability/availability.routes";
import vendorRoutes from "./modules/vendors/vendor.routes";
import policyRoutes from "./modules/policies/policy.routes";
import bookingRoutes from "./modules/bookings/booking.routes";
import paymentRoutes from "./modules/payments/payment.routes";
import reviewRoutes from "./modules/reviews/review.routes";
import uploadRoutes from "./modules/upload/upload.routes";
import favoriteRoutes from "./modules/favorites/favorite.routes";
import vendorBankRoutes from "./modules/vendorBank/bank.routes";
import supportRoutes from "./modules/support/support.routes";

import adventureRoutes from "./modules/adventure/category/adventure.routes";
import serviceRoutes from "./modules/adventure/service/service.routes";
import cabRoutes from "./modules/cab/company/cab.routes";
import cabServiceRoutes from "./modules/cab/service/cabService.routes";
import bikeRoutes from "./modules/bike/company/bike.routes";
import bikeServiceRoutes from "./modules/bike/service/bikeService.routes";
import tourRoutes from "./modules/tour/company/tour.routes";
import tourServiceRoutes from "./modules/tour/service/tourService.routes";

import multiServiceBookingRoutes from "./modules/multiServiceBookings/booking.routes";
import multiServiceVendorRoutes from "./modules/multiServiceVendor/vendor.routes";

import vendorAccountRoutes from "./modules/vendorAccountGroup/accountGroup.routes";

import adminRoutes from "./modules/admin/property/property.routes";
import adminUserRoutes from "./modules/admin/user/user.routes";
import adminBookingRoutes from "./modules/admin/booking/booking.routes";
import adminReviewRoutes from "./modules/admin/review/review.routes";
import adminPaymentRoutes from "./modules/admin/payment/payment.routes";
import adminSupportRoutes from "./modules/admin/support/support.routes";
import adminDashboardRoutes from "./modules/admin/dashboard/dashboard.routes";
import adminTaxRoutes from "./modules/admin/tax/tax.routes";
import adminAccountDeactivateRoutes from "./modules/admin/account-deactivate/account.routes";
import adminPromotionRoutes from "./modules/admin/promotion/promotion.routes";
import { errorHandler } from "./shared/middlewares/errorHandler";
import "./shared/config/passport";

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

// ── CORS must be registered BEFORE helmet so preflight (OPTIONS) requests
//    are handled before helmet can set restrictive headers ──
app.use(
  cors({
    origin: function (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.includes("trivllo.com") ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1")
      ) {
        callback(null, true);
      } else if (process.env.NODE_ENV !== "production") {
        // Allow all origins in non-production environments
        callback(null, true);
      } else {
        callback(null, false);
      }
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

// Rate limiting..
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000, // Reasonable limit for busy single-page apps
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// ── oRPC handler (must be BEFORE express.json so it reads the raw stream) ──
const rpcHandler = new RPCHandler(appRouter);

app.use(async (req, res, next) => {
  if (req.url.startsWith("/rpc")) {
    const { matched } = await rpcHandler.handle(req, res, {
      prefix: "/rpc",
      context: {},
    });
    if (matched) return;
  }
  next();
});

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

app.use(errorHandler);

export default app;
