import { Request, Response, NextFunction } from "express";
import bookingService from "./booking.service";
import logger from "src/shared/utils/logger";

export class BookingController {
  // Get all bookings
  public async getAllBookings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await bookingService.getAllBookings(req.query);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getAllBookings", error);
      next(error);
    }
  }

  // Get booking detail
  public async getBookingDetail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await bookingService.getBookingDetail(req.params.bookingId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getBookingDetail(Admin)", error);
      next(error);
    }
  }

  // Get booking stats
  public async getBookingStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await bookingService.getBookingStats();

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getBookingStats", error);
      next(error);
    }
  }
}
