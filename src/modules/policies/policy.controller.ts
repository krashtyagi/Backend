import { Request, Response, NextFunction } from "express";
import Vendor from "../vendors/vendor.model.js";
import Hotel from "../hotels/hotel.model.js";
import policyService from "./policy.service.js";
import logger from "../../shared/utils/logger.js";

export class PolicyController {
  //Vendor: set policy
  public async setPolicy(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });
      if (!vendor) throw new Error("Vendor profile not found");

      const hotel = await Hotel.findOne({
        _id: req.body.hotelId,
        vendorId: vendor._id,
      });

      if (!hotel) throw new Error("Unauthorized hotel access");

      const policy = await policyService.upsertPolicy(req.body.hotelId, req.body);

      res.status(200).json({
        success: true,
        message: "Hotel policy updated",
        data: policy,
      });
    } catch (error) {
      logger.error("Controller Error: setPolicy", error);
      next(error);
    }
  }

  //User: get policy
  public async getPolicy(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const policy = await policyService.getPolicyByHotel(req.params.hotelId);

      res.status(200).json({
        success: true,
        data: policy,
      });
    } catch (error) {
      logger.error("Controller Error: getPolicy", error);
      next(error);
    }
  }
}
