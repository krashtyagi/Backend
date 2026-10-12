import { Request, Response, NextFunction } from "express";
import cabService from "./cab.service.js";
import Vendor from "../../vendors/vendor.model.js";
import logger from "../../../shared/utils/logger.js";

export class CabController {
  public async createCabCompany(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;

      // FIND VENDOR
      const vendor = await Vendor.findOne({ userId });

      if (!vendor) {
        throw new Error("Vendor profile not found");
      }

      // CREATE / UPDATE CAB COMPANY
      const cab = await cabService.createCabCompany(vendor, req.body);

      res.status(200).json({
        success: true,
        message: "Step 4 completed successfully",
        data: {
          currentStep: vendor.currentStep,
          registrationStep: vendor.registrationStep,
          status: vendor.status,
        },
      });
    } catch (error) {
      logger.error("Controller Error: createCabCompany", error);

      next(error);
    }
  }
}
