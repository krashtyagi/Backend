import { Router } from "express";
import dashboardRoutes from "./dashboard/dashboard.routes";
import bookingRoutes from "./booking/booking.routes";
import invoiceRoutes from "./invoice/invoice.routes";

const router = Router();

router.use("/dashboard", dashboardRoutes);
router.use("/bookings", bookingRoutes);
router.use("/invoices", invoiceRoutes);

export default router;
