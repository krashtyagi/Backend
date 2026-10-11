import { Request, Response, NextFunction } from "express";
import availabilityService from "./availability.service";
import Vendor from "../vendors/vendor.model";
import RoomType from "../rooms/roomType.model";
import Hotel from "../hotels/hotel.model";
import logger from "../../shared/utils/logger";

export class AvailabilityController {
  //Vendor: Set availability for a date
  public async setAvailability(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });
      if (!vendor) throw new Error("Vendor profile not found");

      const roomType = await RoomType.findById(req.body.roomTypeId);
      if (!roomType) throw new Error("Room type not found");

      const hotel = await Hotel.findOne({
        _id: roomType.hotelId,
        vendorId: vendor._id,
      });

      if (!hotel) throw new Error("Unauthorized hotel access");

      const availability = await availabilityService.upsertAvailability(req.body);

      res.status(200).json({
        success: true,
        message: "Availability updated",
        data: availability,
      });
    } catch (error) {
      logger.error("Controller Error: setAvailability", error);
      next(error);
    }
  }

  //User: Get availability calendar
  public async getAvailability(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { roomTypeId, startDate, endDate } = req.query;

      if (!roomTypeId || !startDate || !endDate) {
        throw new Error("roomTypeId, startDate and endDate are required");
      }

      const availability = await availabilityService.getAvailabilityForRange(
        roomTypeId,
        startDate,
        endDate,
      );

      res.status(200).json({
        success: true,
        count: availability.length,
        data: availability,
      });
    } catch (error) {
      logger.error("Controller Error: getAvailability", error);
      next(error);
    }
  }

  //Get vendor room types
  public async getVendorRoomTypes(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const { hotelId } = req.params;

      const roomTypes = await availabilityService.getVendorRoomTypes(
        userId,
        hotelId,
      );

      res.status(200).json({
        success: true,
        count: roomTypes.length,
        data: roomTypes,
      });
    } catch (error) {
      logger.error("Controller Error: getVendorRoomTypes", error);
      next(error);
    }
  }

  //room tpye calender data return
  public async getRoomTypeCalendar(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const { roomTypeId } = req.params;
      const { month, year } = req.query;

      const now = new Date();

      const targetMonth = month ? Number(month) : now.getMonth() + 1;
      const targetYear = year ? Number(year) : now.getFullYear();

      const calendar = await availabilityService.getRoomTypeCalendar(
        userId,
        roomTypeId,
        targetMonth,
        targetYear,
      );

      res.status(200).json({
        success: true,
        data: calendar,
      });
    } catch (error) {
      logger.error("Controller Error: getRoomTypeCalendar", error);
      next(error);
    }
  }

  //date and price over-ride for perticular date
  public async updateRoomTypeCalendar(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const { roomTypeId } = req.params;
      const { date, blockedRooms, priceOverride } = req.body;

      const result = await availabilityService.updateRoomTypeCalendar(
        userId,
        roomTypeId,
        date,
        blockedRooms,
        priceOverride,
      );

      res.status(200).json({
        success: true,
        message: "Calendar updated successfully",
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: updateRoomTypeCalendar", error);
      next(error);
    }
  }

  public async resetRoomTypeCalendar(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendorId = (req as any).user._id;
      const { roomTypeId } = req.params;
      const { date } = req.body;

      const result = await availabilityService.resetRoomTypeCalendar(
        vendorId,
        roomTypeId,
        date,
      );

      res.status(200).json({
        success: true,
        message: "Calendar override removed",
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: resetRoomTypeCalendar", error);
      next(error);
    }
  }
}
