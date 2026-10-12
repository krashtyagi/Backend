import { Router } from "express";
import { DashboardController } from "./dashboard.controller.js";
import { protect } from "../../../shared/middlewares/verifyToken.js";
import { authorize } from "../../../shared/middlewares/roleMiddleware.js";

const router = Router();
const dashboardController = new DashboardController();

//dashboard stats with card
router.get("/", protect, authorize("admin"), dashboardController.getDashboard);

//Recent bookings
router.get(
  "/recent-bookings",
  protect,
  authorize("admin"),
  dashboardController.getRecentBookings,
);

export default router;
