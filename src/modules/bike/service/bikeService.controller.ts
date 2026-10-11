import { Request, Response, NextFunction } from "express";
import bikeServiceSvc from "./bikeService.service";
import logger from "src/shared/utils/logger";
import Vendor from "../../vendors/vendor.model";

export class BikeServiceController {
  //user side
  public async getBikes(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id || null;
      const data = await bikeServiceSvc.getBikes(req.query, userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: getBikes", error);
      next(error);
    }
  }

  public async getBikeCompanyDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user._id || null;

      const data = await bikeServiceSvc.getBikeCompanyDetails(id, userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: getBikeCompanyDetails", error);
      next(error);
    }
  }

  public async getBikeServiceDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user._id || null;

      const data = await bikeServiceSvc.getBikeServiceDetails(id, userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: getBikeServiceDetails", error);
      next(error);
    }
  }

  public async calculateBikePrice(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = await bikeServiceSvc.calculateBikePrice(req.body);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: calculateBikePrice", error);
      next(error);
    }
  }

  //vendor side
  public async createBikeService(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;

      const vendor = await Vendor.findOne({
        userId,
      });

      if (!vendor) {
        throw new Error("Vendor profile not found");
      }

      const service = await bikeServiceSvc.createBikeService(req.body, vendor._id);

      res.status(201).json({
        success: true,
        message: "Bike service created successfully",
        data: service,
      });
    } catch (error) {
      logger.error("Controller Error: createBikeService", error);
      next(error);
    }
  }

  public async getVendorBikeServices(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;

      const vendor = await Vendor.findOne({
        userId,
      });

      if (!vendor) {
        throw new Error("Vendor profile not found");
      }

      const result = await bikeServiceSvc.getVendorBikeServices(
        req.query,
        vendor._id,
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error("Controller Error: getVendorBikeServices", error);
      next(error);
    }
  }

  public async getVendorBikeServiceById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const serviceId = req.params.id;

      const vendor = await Vendor.findOne({
        userId,
      });

      if (!vendor) {
        throw new Error("Vendor profile not found");
      }

      const service = await bikeServiceSvc.getVendorBikeServiceById(
        serviceId,
        vendor._id,
      );

      res.status(200).json({
        success: true,
        data: service,
      });
    } catch (error) {
      logger.error("Controller Error: getVendorBikeServiceById", error);
      next(error);
    }
  }

  public async updateVendorBikeService(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const serviceId = req.params.id;

      const vendor = await Vendor.findOne({
        userId,
      });

      if (!vendor) {
        throw new Error("Vendor profile not found");
      }

      const updated = await bikeServiceSvc.updateVendorBikeService(
        serviceId,
        vendor._id,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: "Bike service updated successfully",
        data: updated,
      });
    } catch (error) {
      logger.error("Controller Error: updateBikeService", error);
      next(error);
    }
  }

  public async deleteVendorBikeService(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const serviceId = req.params.id;

      const vendor = await Vendor.findOne({
        userId,
      });

      if (!vendor) {
        throw new Error("Vendor profile not found");
      }

      await bikeServiceSvc.deleteVendorBikeService(serviceId, vendor._id);

      res.status(200).json({
        success: true,
        message: "Bike service deleted successfully",
      });
    } catch (error) {
      logger.error("Controller Error: deleteBikeService", error);
      next(error);
    }
  }
}
