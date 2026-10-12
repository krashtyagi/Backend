import { Router } from "express";
import dashboardRoutes from "./dashboard/dashboard.routes.js";
import bookingRoutes from "./booking/booking.routes.js";
import invoiceRoutes from "./invoice/invoice.routes.js";

const router = Router();

router.use("/dashboard", dashboardRoutes);
router.use("/bookings", bookingRoutes);
router.use("/invoices", invoiceRoutes);

export default router;
