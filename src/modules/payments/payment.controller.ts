import { Request, Response, NextFunction } from "express";
import paymentService from "./payment.service";

export class PaymentController {
  public async verifyPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const booking = await paymentService.verifyPayment(req.body);

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (err) {
      next(err);
    }
  }
}
