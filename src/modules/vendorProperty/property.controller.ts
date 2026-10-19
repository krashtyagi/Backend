import { Request, Response, NextFunction } from "express";
import * as propertyService from "./property.service.js";
import logger from "../../shared/utils/logger.js";

export class VendorPropertyController {
  /**
   * GET /vendor/properties — List all properties for current vendor
   */
  public async getVendorProperties(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const data = await propertyService.getVendorProperties(userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      logger.error("Controller Error: getVendorProperties", error);
      next(error);
    }
  }

  /**
   * POST /vendor/properties/add — Add a new property
   */
  public async addVendorProperty(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const data = await propertyService.addVendorProperty(userId, req.body);

      res.status(201).json({
        success: true,
        message: data.message,
        data,
      });
    } catch (error: any) {
      logger.error("Controller Error: addVendorProperty", error);
      next(error);
    }
  }

  /**
   * POST /vendor/properties/switch — Switch active property
   */
  public async switchActiveProperty(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const { propertyId } = req.body;

      if (!propertyId) {
        res.status(400).json({
          success: false,
          message: "propertyId is required",
        });
        return;
      }

      const data = await propertyService.switchActiveProperty(
        userId,
        propertyId,
      );

      res.status(200).json({
        success: true,
        message: "Active property switched successfully",
        data,
      });
    } catch (error: any) {
      logger.error("Controller Error: switchActiveProperty", error);
      next(error);
    }
  }

  /**
   * GET /vendor/properties/active — Get active property details
   */
  public async getActiveProperty(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const data = await propertyService.getActiveProperty(userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      logger.error("Controller Error: getActiveProperty", error);
      next(error);
    }
  }

  /**
   * Admin: GET /admin/vendor-properties/pending — Get pending additional properties
   */
  public async getPendingAdditionalProperties(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = await propertyService.getPendingAdditionalProperties(
        req.query,
      );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      logger.error(
        "Controller Error: getPendingAdditionalProperties",
        error,
      );
      next(error);
    }
  }

  /**
   * Admin: POST /admin/vendor-properties/:id/approve
   */
  public async approveAdditionalProperty(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { serviceType } = req.body;

      if (!serviceType) {
        res.status(400).json({
          success: false,
          message: "serviceType is required",
        });
        return;
      }

      const data = await propertyService.approveAdditionalProperty(
        serviceType,
        id as string,
        (req as any).user._id,
      );

      res.status(200).json({
        success: true,
        message: "Property approved successfully",
        data,
      });
    } catch (error: any) {
      logger.error("Controller Error: approveAdditionalProperty", error);
      next(error);
    }
  }

  /**
   * Admin: POST /admin/vendor-properties/:id/reject
   */
  public async rejectAdditionalProperty(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { serviceType, reason } = req.body;

      if (!serviceType) {
        res.status(400).json({
          success: false,
          message: "serviceType is required",
        });
        return;
      }

      const data = await propertyService.rejectAdditionalProperty(
        serviceType,
        id as string,
        reason || "No reason provided",
        (req as any).user._id,
      );

      res.status(200).json({
        success: true,
        message: "Property rejected",
        data,
      });
    } catch (error: any) {
      logger.error("Controller Error: rejectAdditionalProperty", error);
      next(error);
    }
  }
}

export const vendorPropertyController = new VendorPropertyController();
export default vendorPropertyController;
