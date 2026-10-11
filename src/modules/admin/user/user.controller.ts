import { Request, Response, NextFunction } from "express";
import userService from "./user.service";
import logger from "src/shared/utils/logger";

export class UserController {
  // Get all users
  public async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await userService.getAllUsers(req.query);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getAllUsers", error);
      next(error);
    }
  }

  //Get user booking history list
  public async getUserBookings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await userService.getUserBookings(
        req.params.userId,
        req.query,
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getUserBookings", error);
      next(error);
    }
  }

  // Get booking detail
  public async getBookingDetail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await userService.getBookingDetail(
        req.params.userId,
        req.params.bookingId,
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getBookingDetail", error);
      next(error);
    }
  }

  // Block / Unblock user
  public async updateUserStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await userService.updateUserStatus(
        req.params.userId,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.user,
      });
    } catch (error) {
      logger.error("Controller Error: updateUserStatus", error);
      next(error);
    }
  }
}
