import { Request, Response, NextFunction } from "express";
import hotelService from "./hotel.service.js";
import logger from "../../shared/utils/logger.js";
import Vendor from "../vendors/vendor.model.js";

export class HotelController {
  /**
   * Create or update hotel details for vendor onboarding step 4
   */
  async createHotel(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user?._id;

      const vendor = await Vendor.findOne({ userId });

      if (!vendor) {
        throw new Error("Vendor profile not found");
      }

      const hotel = await hotelService.createHotel(vendor, req.body);

      res.status(200).json({
        success: true,
        message: "Step 4 completed successfully",
        data: {
          currentStep: vendor.currentStep,
          registrationStep: vendor.registrationStep,
          status: vendor.status,
          hotel,
        },
      });
    } catch (error) {
      logger.error("Controller Error: createHotel", error);
      next(error);
    }
  }

  /**
   * Get all hotels with filtering and pagination support
   */
  async getHotels(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user?._id || null;

      const { hotels, total } = await hotelService.getAllHotels(
        req.query,
        userId,
      );

      res.status(200).json({
        success: true,
        count: hotels.length,
        total,
        data: hotels,
      });
    } catch (error) {
      logger.error("Controller Error: getHotels", error);
      next(error);
    }
  }

  /**
   * Get a single hotel by ID for the details page
   */
  async getHotelDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user?._id || null;
      const hotel = await hotelService.getHotelDetails(
        req.params.id as string,
        userId,
      );

      res.status(200).json({
        success: true,
        data: hotel,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check room availability and calculate prices with taxes
   */
  async getHotelAvailability(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { checkIn, checkOut, adults, children } = req.query;

      const data = await hotelService.getHotelAvailability(
        req.params.id as string,
        checkIn as string,
        checkOut as string,
        adults ? Number(adults) : undefined,
        children ? Number(children) : undefined,
      );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update hotel details (owner vendor only)
   */
  async updateHotel(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user?._id });

      if (!vendor) throw new Error("Vendor profile not found");

      const hotel = await hotelService.updateHotel(
        req.params.id as string,
        vendor._id,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: "Hotel updated successfully",
        data: hotel,
      });
    } catch (error) {
      logger.error("Controller Error: updateHotel", error);
      next(error);
    }
  }

  /**
   * Search nearby hotels based on coordinates (Geospatial API using MongoDB 2dsphere index)
   * GET /api/v1/hotels/nearby?lat=...&lng=...&radius=2000&limit=20
   */
  async getNearbyHotels(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { lng, lat, radius, distance, limit } = req.query;

      if (!lng || !lat) {
        res.status(400).json({
          success: false,
          message: "Please provide both latitude and longitude query parameters.",
        });
        return;
      }

      const numLat = Number(lat);
      const numLng = Number(lng);

      if (
        isNaN(numLat) ||
        isNaN(numLng) ||
        numLat < -90 ||
        numLat > 90 ||
        numLng < -180 ||
        numLng > 180
      ) {
        res.status(400).json({
          success: false,
          message: "Valid latitude (-90 to 90) and longitude (-180 to 180) are required.",
        });
        return;
      }

      const radiusMeters = Number(radius || distance) || 2000;
      const limitCount = Math.min(Math.max(Number(limit) || 20, 1), 100);
      const userId: string = (req as any).user?._id || null;

      const hotels = await hotelService.findNearbyHotels(
        numLng,
        numLat,
        radiusMeters,
        limitCount,
        userId,
      );

      res.status(200).json({
        success: true,
        count: hotels.length,
        radius: radiusMeters,
        coordinates: [numLng, numLat],
        data: hotels,
      });
    } catch (error) {
      logger.error("Controller Error: getNearbyHotels", error);
      next(error);
    }
  }

  /**
   * Get hotels for home screen
   */
  async getHomeHotels(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user?._id || null;

      const hotels = await hotelService.getHomeHotels(req.query as any, userId);

      res.status(200).json({
        success: true,
        count: hotels.length,
        data: hotels,
      });
    } catch (error) {
      logger.error("Controller Error: getHomeHotels", error);
      next(error);
    }
  }

  /**
   * Get auto-suggestions for search
   */
  async getSuggestions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { q } = req.query;

      const suggestions = await hotelService.getSuggestions(q as string);

      res.status(200).json({
        success: true,
        count: suggestions.length,
        data: suggestions,
      });
    } catch (error) {
      logger.error("Controller Error: getSuggestions", error);
      next(error);
    }
  }

  /**
   * Search hotels in destination
   */
  async searchHotels(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user?._id || null;
      const hotels = await hotelService.searchHotels(req.query, userId);

      res.status(200).json({
        success: true,
        count: hotels.length,
        data: hotels,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get ranked hotels for banner slideshows
   */
  async getRankedHotels(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { rank, page, limit } = req.query;
      const result = await hotelService.getRankedHotels(
        rank as string,
        page ? Number(page) : 1,
        limit ? Number(limit) : 10,
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error("Controller Error: getRankedHotels", error);
      next(error);
    }
  }
}

export const hotelController = new HotelController();

// Bound handler exports
export const createHotel = hotelController.createHotel.bind(hotelController);
export const getHotels = hotelController.getHotels.bind(hotelController);
export const getHotelDetails =
  hotelController.getHotelDetails.bind(hotelController);
export const getHotelAvailability =
  hotelController.getHotelAvailability.bind(hotelController);
export const updateHotel = hotelController.updateHotel.bind(hotelController);
export const getNearbyHotels =
  hotelController.getNearbyHotels.bind(hotelController);
export const getHomeHotels =
  hotelController.getHomeHotels.bind(hotelController);
export const getSuggestions =
  hotelController.getSuggestions.bind(hotelController);
export const searchHotels = hotelController.searchHotels.bind(hotelController);
export const getRankedHotels =
  hotelController.getRankedHotels.bind(hotelController);

export default hotelController;

