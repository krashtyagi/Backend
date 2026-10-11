import { Request, Response, NextFunction } from "express";
import cabServiceSvc from "./cabService.service";
import logger from "src/shared/utils/logger";
import Vendor from "../../vendors/vendor.model";

export class CabServiceController {
  //user side...
  public async getCabs(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id || null;
      const data = await cabServiceSvc.getCabs(req.query, userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: getCabs", error);
      next(error);
    }
  }

  public async getCabCompanyDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user._id || null;

      const data = await cabServiceSvc.getCabCompanyDetails(id, userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: getCabCompanyDetails", error);
      next(error);
    }
  }

  public async getCabServiceDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user._id || null;

      const data = await cabServiceSvc.getCabServiceDetails(id, userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: getCabServiceDetails", error);
      next(error);
    }
  }

  //vendor side....
  public async createCabService(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;

      const vendor = await Vendor.findOne({ userId });

      if (!vendor) {
        throw new Error("Vendor profile not found");
      }

      const service = await cabServiceSvc.createCabService(req.body, vendor._id);

      res.status(201).json({
        success: true,
        message: "Cab service created successfully",
        data: service,
      });
    } catch (error) {
      logger.error("Controller Error: createCabService", error);
      next(error);
    }
  }

  public async getVendorCabServices(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const vendor = await Vendor.findOne({ userId });

      if (!vendor) {
        throw new Error("Vendor profile not found");
      }

      const result = await cabServiceSvc.getVendorCabServices(req.query, vendor._id);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error("Controller Error: getVendorCabServices", error);
      next(error);
    }
  }

  public async getVendorCabServiceById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const serviceId = req.params.id;

      const vendor = await Vendor.findOne({ userId });

      if (!vendor) {
        throw new Error("Vendor profile not found");
      }

      const service = await cabServiceSvc.getVendorCabServiceById(
        serviceId,
        vendor._id,
      );

      res.status(200).json({
        success: true,
        data: service,
      });
    } catch (error) {
      logger.error("Controller Error: getVendorCabServiceById", error);
      next(error);
    }
  }

  public async updateVendorCabService(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const serviceId = req.params.id;

      const vendor = await Vendor.findOne({ userId });

      if (!vendor) {
        throw new Error("Vendor profile not found");
      }

      const updated = await cabServiceSvc.updateVendorCabService(
        serviceId,
        vendor._id,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: "Cab service updated successfully",
        data: updated,
      });
    } catch (error) {
      logger.error("Controller Error: updateCabService", error);
      next(error);
    }
  }

  public async deleteVendorCabService(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const serviceId = req.params.id;

      const vendor = await Vendor.findOne({ userId });

      if (!vendor) {
        throw new Error("Vendor profile not found");
      }

      await cabServiceSvc.deleteVendorCabService(serviceId, vendor._id);

      res.status(200).json({
        success: true,
        message: "Cab service deleted successfully",
      });
    } catch (error) {
      logger.error("Controller Error: deleteCabService", error);
      next(error);
    }
  }
}
