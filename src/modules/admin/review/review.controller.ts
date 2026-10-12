import { Request, Response, NextFunction } from "express";
import reviewService from "./review.service.js";
import logger from "../../../shared/utils/logger.js";

export class ReviewController {
  public async getReviewStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await reviewService.getReviewStats();

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getReviewStats", error);
      next(error);
    }
  }

  public async getAllReviews(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await reviewService.getAllReviews(req.query);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getAllReviews", error);
      next(error);
    }
  }

  public async getReviewDetail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await reviewService.getReviewDetail(req.params.reviewId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getReviewDetail", error);
      next(error);
    }
  }

  public async deleteReview(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await reviewService.deleteReview(req.params.reviewId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      logger.error("Controller Error: deleteReview", error);
      next(error);
    }
  }

  public async flagReview(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await reviewService.flagReview(
        req.params.reviewId,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.review,
      });
    } catch (error) {
      logger.error("Controller Error: flagReview", error);
      next(error);
    }
  }
}
