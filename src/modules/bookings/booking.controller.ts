import { Request, Response, NextFunction } from "express";
import bookingService from "./booking.service";
import Booking from "./booking.model";
import logger from "../../shared/utils/logger";

export class BookingController {
  //Create Booking
  public async createBooking(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const booking = await bookingService.createBooking(
        req.body,
        (req as any).user._id,
      );

      res.status(201).json({
        success: true,
        message: "Booking Created Payment Pending",
        data: booking,
      });
    } catch (error) {
      logger.error("Controller Error: createBooking", error);
      next(error);
    }
  }

  //Get logged-in user's bookings
  public async getMyBookings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const bookings = await bookingService.getUserBookings(
        (req as any).user._id,
      );

      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    } catch (err) {
      logger.error("Controller Error: getMyBookings", err);
      next(err);
    }
  }

  // user booking invoice download
  public async downloadMyInvoice(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const booking = await Booking.findOne({
        _id: req.params.bookingId,
        userId: (req as any).user._id,
      })
        .populate({
          path: "roomTypeId",
          select: "name basePrice discountPrice roomSizeSqm beds amenities",
        })
        .lean();

      if (!booking) {
        res.status(404).json({
          success: false,
          message:
            "Booking not found or you are not authorized to view this invoice",
        });
        return;
      }

      // Generate and Stream PDF
      await bookingService.userInvoiceDownload(booking, res);
    } catch (error) {
      logger.error("User Invoice Download Error:", error);
      next(error);
    }
  }

  //get booking detail by id
  public async getBookingById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const booking = await bookingService.getBookingDetail(
        req.params.id,
        (req as any).user._id,
      );

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (err) {
      next(err);
    }
  }

  // Get refund preview before cancellation
  public async getRefundPreview(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await bookingService.getRefundPreview(
        req.params.id,
        (req as any).user._id,
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getRefundPreview", error);
      next(error);
    }
  }

  // Cancel booking ( refund request)
  public async cancelBooking(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const booking = await bookingService.cancelBooking(
        req.params.id,
        (req as any).user._id,
        req.body.reason,
      );

      res.status(200).json({
        success: true,
        message: "Cancellation request submitted",
        data: booking,
      });
    } catch (err) {
      logger.error("Controller Error: cancelBooking", err);
      next(err);
    }
  }

  //Admin approve/reject refund request
  public async handleRefund(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const booking = await bookingService.adminHandleRefund(
        req.params.id,
        req.body.action, //approve | reject
      );

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (err) {
      next(err);
    }
  }
}
