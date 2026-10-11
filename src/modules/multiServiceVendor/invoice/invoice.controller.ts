import { Request, Response, NextFunction } from "express";
import invoiceService from "./invoice.service";
import Vendor from "../../vendors/vendor.model";
import logger from "../../../shared/utils/logger";

export class MSVInvoiceController {
  public async getVendorInvoiceList(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });

      if (!vendor) {
        throw new Error("Vendor not found");
      }

      const result = await invoiceService.getVendorInvoiceList(req.query, vendor);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error("Controller Error: getVendorInvoices", error);
      next(error);
    }
  }

  public async downloadInvoicePdf(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });

      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({
          success: false,
          message: "Vendor not authorized",
        });
        return;
      }

      await invoiceService.generateInvoicePdf(req.params.bookingId, vendor, res);
    } catch (error) {
      logger.error("Download Invoice Error:", error);
      next(error);
    }
  }
}
