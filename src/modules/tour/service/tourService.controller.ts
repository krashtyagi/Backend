import { Request, Response, NextFunction } from "express";
import tourService from "./tourService.service.js";
import logger from "../../../shared/utils/logger.js";
import Vendor from "../../vendors/vendor.model.js";

export class TourServiceController {
  //user side

  public async getTours(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id || null;
      const data = await tourService.getTours(req.query, userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: getTours", error);
      next(error);
    }
  }

  public async getCompanyDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user._id || null;

      const data = await tourService.getCompanyDetails(id, userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: getCompanyDetails", error);
      next(error);
    }
  }

  public async getTourServiceDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user._id || null;

      const data = await tourService.getTourServiceDetails(id, userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: getTourServiceDetails", error);
      next(error);
    }
  }

  //vendor side
  public async createTourService(
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

      const service = await tourService.createTourService(req.body, vendor._id);

      res.status(201).json({
        success: true,
        message: "Tour service created successfully",
        data: service,
      });
    } catch (error) {
      logger.error("Controller Error: createTourService", error);
      next(error);
    }
  }

  public async getVendorTourServices(
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

      const result = await tourService.getVendorTourServices(
        req.query,
        vendor._id,
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error("Controller Error: getVendorTourServices", error);
      next(error);
    }
  }

  public async getVendorTourServiceById(
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

      const service = await tourService.getVendorTourServiceById(
        serviceId,
        vendor._id,
      );

      res.status(200).json({
        success: true,
        data: service,
      });
    } catch (error) {
      logger.error("Controller Error: getVendorTourServiceById", error);
      next(error);
    }
  }

  public async updateVendorTourService(
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

      const updated = await tourService.updateVendorTourService(
        serviceId,
        vendor._id,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: "Tour service updated successfully",
        data: updated,
      });
    } catch (error) {
      logger.error("Controller Error: updateTourService", error);
      next(error);
    }
  }

  public async deleteVendorTourService(
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

      await tourService.deleteVendorTourService(serviceId, vendor._id);

      res.status(200).json({
        success: true,
        message: "Tour service deleted successfully",
      });
    } catch (error) {
      logger.error("Controller Error: deleteTourService", error);
      next(error);
    }
  }
}
