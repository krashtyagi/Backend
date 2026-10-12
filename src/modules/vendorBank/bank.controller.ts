import { Request, Response, NextFunction } from "express";
import Vendor from "../vendors/vendor.model.js";
import bankService from "./bank.service.js";
import logger from "../../shared/utils/logger.js";

export class BankController {
  //Create vendor bank details
  public async createBankDetails(
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

      const bank = await bankService.createBankDetails(vendor, req.body);

      res.status(200).json({
        success: true,
        message: "Step 3 saved successfully",
        data: {
          currentStep: vendor.currentStep,
          registrationStep: vendor.registrationStep,
          status: vendor.status,
        },
      });
    } catch (error) {
      logger.error("Controller Error: createBankDetails", error);
      next(error);
    }
  }
}
