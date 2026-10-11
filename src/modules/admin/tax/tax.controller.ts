import { Request, Response, NextFunction } from "express";
import taxService from "./tax.service";

export class TaxController {
  public async setTax(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const { taxPercentage } = req.body;

      const tax = await taxService.setTax(userId, taxPercentage);

      res.status(200).json({
        success: true,
        message: "Tax updated successfully",
        data: tax,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getActiveTax(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const tax = await taxService.getActiveTax();

      res.status(200).json({
        success: true,
        data: tax,
      });
    } catch (error) {
      next(error);
    }
  }
}
