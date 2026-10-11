import { Request, Response, NextFunction } from "express";
import bookingService from "./booking.service";
import logger from "../../shared/utils/logger";

export class MultiServiceBookingController {
  public async createBooking(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;

      const result = await bookingService.createBooking(req.body, userId);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: createBooking", error);
      next(error);
    }
  }

  public async verifyPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const booking = await bookingService.verifyPayment(req.body);

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      logger.error("Controller Error: verifyPayment", error);
      next(error);
    }
  }
}
