import { Router } from "express";
import { MSVDashboardController } from "./dashboard.controller.js";
import { protect } from "../../../shared/middlewares/verifyToken.js";
import { authorize } from "../../../shared/middlewares/roleMiddleware.js";

const router = Router();
const dashboardController = new MSVDashboardController();

router.use(protect);

router.get(
  "/stats",
  protect,
  authorize("vendor"),
  dashboardController.getDashboardStats,
);

router.get(
  "/analytics",
  protect,
  authorize("vendor"),
  dashboardController.getDashboardAnalytics,
);

router.get(
  "/recent-bookings",
  protect,
  authorize("vendor"),
  dashboardController.getRecentBookings,
);

export default router;
