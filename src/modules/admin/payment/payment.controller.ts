import { Request, Response, NextFunction } from "express";
import paymentService from "./payment.service.js";
import logger from "../../../shared/utils/logger.js";

export class PaymentController {
  // Get payment stats
  public async getPaymentStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await paymentService.getPaymentStats();

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getPaymentStats", error);
      next(error);
    }
  }

  // Get all payments
  public async getAllPayments(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await paymentService.getAllPayments(req.query);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getAllPayments", error);
      next(error);
    }
  }

  // Get payment detail
  public async getPaymentDetail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await paymentService.getPaymentDetail(req.params.paymentId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getPaymentDetail", error);
      next(error);
    }
  }

  // Get payment analytics
  public async getPaymentAnalytics(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await paymentService.getPaymentAnalytics(req.query);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getPaymentAnalytics", error);
      next(error);
    }
  }

  // Get refund requests
  public async getRefundRequests(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await paymentService.getRefundRequests(req.query);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getRefundRequests", error);
      next(error);
    }
  }

  // Handle refund (approve / reject)
  public async handleRefund(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await paymentService.handleRefund(
        req.params.paymentId,
        req.body.action, // approve | reject
      );

      res.status(200).json({
        success: true,
        message: `Refund ${req.body.action} successfully`,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: handleRefund", error);
      next(error);
    }
  }
}
