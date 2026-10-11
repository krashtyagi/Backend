import { Request, Response, NextFunction } from "express";
import dashboardService from "./dashboard.service";
import logger from "../../../shared/utils/logger";
import Vendor from "../../vendors/vendor.model";

export class MSVDashboardController {
  public async getDashboardStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });

      if (!vendor) {
        throw new Error("Vendor not found");
      }

      const stats = await dashboardService.getDashboardStats(req.query, vendor);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error("Controller Error: getDashboardStats", error);
      next(error);
    }
  }

  public async getDashboardAnalytics(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });

      if (!vendor) {
        throw new Error("Vendor not found");
      }

      const data = await dashboardService.getDashboardAnalytics(
        req.query,
        vendor,
      );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: getDashboardAnalytics", error);
      next(error);
    }
  }

  public async getRecentBookings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });

      if (!vendor) {
        throw new Error("Vendor not found");
      }

      const result = await dashboardService.getRecentBookings(req.query, vendor);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error("Controller Error: getRecentBookings", error);
      next(error);
    }
  }
}
