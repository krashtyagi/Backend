import { Request, Response, NextFunction } from "express";
import reviewService from "./review.service";
import logger from "../../shared/utils/logger";

export class ReviewController {
  // Public
  public async getCompanyReviews(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await reviewService.getCompanyReviews(
        req.params.companyType as string,
        req.params.companyId,
        req.query,
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getCompanyReviews", error);

      next(error);
    }
  }

  //user side
  public async getUserReviews(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const result = await reviewService.getUserReviews(userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getUserReviews", error);

      next(error);
    }
  }

  public async createReview(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await reviewService.createReview(
        (req as any).user._id,
        req.body,
      );

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.review,
      });
    } catch (error) {
      logger.error("Controller Error: createReview", error);

      next(error);
    }
  }

  public async updateReview(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await reviewService.updateReview(
        (req as any).user._id,
        req.params.reviewId,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.review,
      });
    } catch (error) {
      logger.error("Controller Error: updateReview", error);

      next(error);
    }
  }

  //vendor side

  public async getVendorReviews(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await reviewService.getVendorReviews(
        (req as any).vendorId,
        req.query,
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getVendorReviews", error);

      next(error);
    }
  }

  public async vendorReply(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await reviewService.vendorReply(
        (req as any).vendorId,
        req.params.reviewId,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.review,
      });
    } catch (error) {
      logger.error("Controller Error: vendorReply", error);

      next(error);
    }
  }
}
