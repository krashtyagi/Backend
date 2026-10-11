import { Request, Response, NextFunction } from "express";
import bikeService from "./bike.service";
import logger from "src/shared/utils/logger";
import Vendor from "../../vendors/vendor.model";

export class BikeController {
  public async createBikeCompany(
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

      const bike = await bikeService.createBikeCompany(req.body, vendor);

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
      logger.error("Controller Error: createBikeCompany", error);
      next(error);
    }
  }
}
