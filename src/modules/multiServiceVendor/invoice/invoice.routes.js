const express = require("express");
const router = express.Router();
const invoiceController = require("./invoice.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

router.get(
  "/",
  protect,
  authorize("vendor"),
  invoiceController.getVendorInvoiceList,
);

router.get(
  "/:bookingId/download",
  protect,
  authorize("vendor"),
  invoiceController.downloadInvoicePdf,
);

module.exports = router;
