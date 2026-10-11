import { Request, Response, NextFunction } from "express";
import logger from "src/shared/utils/logger";
import serviceService from "./service.service";
import Vendor from "../../vendors/vendor.model";

export class ServiceController {
  public async getServiceDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user._id || null;

      const data = await serviceService.getServiceDetails(id, userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: getServiceDetails", error);
      next(error);
    }
  }

  public async getVendorServices(
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

      const services = await serviceService.getVendorServices(vendor._id);

      res.status(200).json({
        success: true,
        count: services.length,
        data: services,
      });
    } catch (error) {
      logger.error("Controller Error: getVendorServices", error);
      next(error);
    }
  }

  public async getVendorServiceById(
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

      const service = await serviceService.getVendorServiceById(
        serviceId,
        vendor._id,
      );

      res.status(200).json({
        success: true,
        data: service,
      });
    } catch (error) {
      logger.error("Controller Error: getVendorServiceById", error);
      next(error);
    }
  }

  public async createService(
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

      const service = await serviceService.createService(req.body, vendor._id);

      res.status(201).json({
        success: true,
        data: service,
      });
    } catch (error) {
      logger.error("Controller Error: createService", error);
      next(error);
    }
  }

  public async updateService(
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

      const service = await serviceService.updateService(
        serviceId,
        req.body,
        vendor._id,
      );

      res.status(200).json({
        success: true,
        data: service,
      });
    } catch (error) {
      logger.error("Controller Error: updateService", error);
      next(error);
    }
  }

  public async deleteService(
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

      await serviceService.deleteService(serviceId, vendor._id);

      res.status(200).json({
        success: true,
        message: "Service deleted successfully",
      });
    } catch (error) {
      logger.error("Controller Error: deleteService", error);
      next(error);
    }
  }
}
