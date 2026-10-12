import { Request, Response, NextFunction } from "express";
import adminPromotionService from "./promotion.service.js";
import logger from "../../../shared/utils/logger.js";

export class PromotionController {
  public async getAllPromotionRequests(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = await adminPromotionService.getAllPromotionRequests();

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: getAllPromotionRequests", error);
      next(error);
    }
  }

  public async approvePromotion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { rank, startDate, endDate } = req.body;
      const adminUserId = (req as any).user._id;

      if (!rank) {
        res.status(400).json({
          success: false,
          message: "Rank is required",
        });
        return;
      }

      const validRanks = ["A", "B", "C"];
      if (!validRanks.includes(rank)) {
        res.status(400).json({
          success: false,
          message: "Invalid rank. Choose between A, B, or C",
        });
        return;
      }

      const data = await adminPromotionService.approvePromotion(
        id,
        adminUserId,
        rank,
        startDate,
        endDate,
      );

      res.status(200).json({
        success: true,
        message: "Promotion approved and rank assigned successfully",
        data,
      });
    } catch (error) {
      logger.error("Controller Error: approvePromotion", error);
      next(error);
    }
  }

  public async assignPropertyPromotion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { vendorId, serviceType, serviceId, rank, startDate, endDate } =
        req.body;
      const adminUserId = (req as any).user._id;

      if (!vendorId || !serviceType || !serviceId || !rank) {
        res.status(400).json({
          success: false,
          message: "vendorId, serviceType, serviceId, and rank are required",
        });
        return;
      }

      const data = await adminPromotionService.assignPropertyPromotion({
        vendorId,
        serviceType,
        serviceId,
        rank,
        startDate,
        endDate,
        adminUserId,
      });

      res.status(200).json({
        success: true,
        message: `Property promoted with Rank ${rank} successfully`,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: assignPropertyPromotion", error);
      next(error);
    }
  }

  public async updatePromotionRank(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { rank } = req.body;

      if (!rank || !["A", "B", "C"].includes(rank)) {
        res.status(400).json({
          success: false,
          message: "Valid rank (A, B, or C) is required",
        });
        return;
      }

      const data = await adminPromotionService.updatePromotionRank(id, rank);

      res.status(200).json({
        success: true,
        message: `Promotion rank updated to ${rank}`,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: updatePromotionRank", error);
      next(error);
    }
  }

  public async updatePromotionDuration(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.body;

      const data = await adminPromotionService.updatePromotionDuration(
        id,
        startDate,
        endDate,
      );

      res.status(200).json({
        success: true,
        message: "Promotion duration updated successfully",
        data,
      });
    } catch (error) {
      logger.error("Controller Error: updatePromotionDuration", error);
      next(error);
    }
  }

  public async removePromotion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const data = await adminPromotionService.removePromotion(id);

      res.status(200).json({
        success: true,
        message: "Promotion and rank removed successfully",
        data,
      });
    } catch (error) {
      logger.error("Controller Error: removePromotion", error);
      next(error);
    }
  }
}
