import { Router } from "express";
import { MSVInvoiceController } from "./invoice.controller";
import { protect } from "../../../shared/middlewares/verifyToken";
import { authorize } from "../../../shared/middlewares/roleMiddleware";

const router = Router();
const invoiceController = new MSVInvoiceController();

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

export default router;
