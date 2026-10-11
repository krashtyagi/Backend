import { Request, Response, NextFunction } from "express";
import bookingService from "./booking.service";
import logger from "../../../shared/utils/logger";
import Vendor from "../../vendors/vendor.model";

export class MSVBookingController {
  public async getVendorBookings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });

      if (!vendor) {
        throw new Error("Vendor not found");
      }

      const result = await bookingService.getVendorBookings(req.query, vendor);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error("Controller Error: getVendorBookings", error);
      next(error);
    }
  }

  public async getVendorBookingById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });

      if (!vendor) {
        throw new Error("Vendor not found");
      }

      const bookingId = req.params.id;

      const booking = await bookingService.getVendorBookingById(
        bookingId,
        vendor,
      );

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      logger.error("Controller Error: getVendorBookingDetail", error);
      next(error);
    }
  }
}
