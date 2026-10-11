import { Request, Response, NextFunction } from "express";
import favoriteService from "./favorite.service";
import logger from "../../shared/utils/logger";

export class FavoriteController {
  public async toggleFavorite(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { itemId, serviceType } = req.params;

      const userId = (req as any).user._id;
      const result = await favoriteService.toggleFavorite(
        userId,
        itemId,
        serviceType as string,
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error("Controller Error: toggleFavorite", error);
      next(error);
    }
  }

  //Get current user's favorites
  public async getMyFavorites(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;

      const favorites = await favoriteService.getUserFavorites(userId);

      res.status(200).json({
        success: true,
        count: favorites.length,
        data: favorites,
      });
    } catch (error) {
      logger.error("Controller Error: getMyFavorites", error);
      next(error);
    }
  }

  //Get favorites summary images
  public async getFavoritesSummary(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;

      const data = await favoriteService.getFavoritesSummary(userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  //Get my trip favorites
  public async getMyTripFavorites(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const { page = 1, limit = 10 } = req.query;

      const hotels = await favoriteService.getMyTripFavorites(
        userId,
        page,
        limit,
      );

      res.status(200).json({
        success: true,
        count: hotels.length,
        data: hotels,
      });
    } catch (error) {
      next(error);
    }
  }
}
