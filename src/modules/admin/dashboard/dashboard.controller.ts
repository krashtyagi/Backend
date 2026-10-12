import { Request, Response, NextFunction } from "express";
import dashboardService from "./dashboard.service.js";
import logger from "../../../shared/utils/logger.js";

export class DashboardController {
  //dashboard card and charts with filter days
  public async getDashboard(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      let bookingRange = Number(req.query.bookingRange);
      let revenueRange = Number(req.query.revenueRange);

      const allowedBooking = [7, 15, 30];
      const allowedRevenue = [3, 6, 12];

      if (!allowedBooking.includes(bookingRange)) {
        bookingRange = 7;
      }

      if (!allowedRevenue.includes(revenueRange)) {
        revenueRange = 6;
      }

      const data = await dashboardService.getDashboard({
        bookingRange,
        revenueRange,
      });

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: getDashboard", error);

      next(error);
    }
  }

  //Get recent bookings
  public async getRecentBookings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await dashboardService.getRecentBookings();

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getRecentBookings", error);
      next(error);
    }
  }
}
