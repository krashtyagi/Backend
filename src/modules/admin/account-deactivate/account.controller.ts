import { Request, Response, NextFunction } from "express";
import accountService from "./account.service.js";
import logger from "../../../shared/utils/logger.js";

export class AccountController {
  public async getDeleteRequests(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await accountService.getDeleteRequests(req.query);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getDeleteRequests", error);
      next(error);
    }
  }

  public async approveDeleteRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await accountService.approveDeleteRequest(
        req.params.userId,
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      logger.error("Controller Error: approveDeleteRequest", error);
      next(error);
    }
  }

  public async rejectDeleteRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await accountService.rejectDeleteRequest(
        req.params.userId,
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      logger.error("Controller Error: rejectDeleteRequest", error);
      next(error);
    }
  }
}
