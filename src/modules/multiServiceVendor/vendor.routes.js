const express = require("express");
const router = express.Router();

const dashboardRoutes = require("./dashboard/dashboard.routes");
const bookingRoutes = require("./booking/booking.routes");
const invoiceRoutes = require("./invoice/invoice.routes");

router.use("/dashboard", dashboardRoutes);
router.use("/bookings", bookingRoutes);
router.use("/invoices", invoiceRoutes);

module.exports = router;