import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { protect } from "src/shared/middlewares/verifyToken";
import { authorize } from "src/shared/middlewares/roleMiddleware";

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
