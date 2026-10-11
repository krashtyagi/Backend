import { Request, Response, NextFunction } from "express";
import userService from "./user.service";
import logger from "src/shared/utils/logger";

export class UserController {
  public async getMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const user = await userService.getUserProfile(userId);
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  public async updateMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const user = await userService.updateUserProfile(userId, req.body);
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
      logger.info(`Profile updated for user: ${user.email}`);
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public async deleteAccountRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const result = await userService.deleteAccountRequest(userId, req.body);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      logger.error("Controller Error: deleteAccountRequest", error);
      next(error);
    }
  }
}
