import { Request, Response, NextFunction } from "express";
import Vendor from "../vendors/vendor.model.js";
import Hotel from "../hotels/hotel.model.js";
import roomService from "./room.service.js";
import logger from "../../shared/utils/logger.js";

export class RoomController {
  public async createRoom(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });
      if (!vendor) throw new Error("Vendor profile not found");

      const hotel = await Hotel.findOne({
        _id: req.body.hotelId,
        vendorId: vendor._id,
      });

      if (!hotel) throw new Error("Unauthorized hotel access");

      const room = await roomService.createRoom(req.body);

      res.status(201).json({
        success: true,
        message: "Room created successfully",
        data: room,
      });
    } catch (error) {
      logger.error("Controller Error: createRoom", error);
      next(error);
    }
  }

  public async getRoomsByHotel(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const rooms = await roomService.getRoomsByHotel(req.params.hotelId);

      res.status(200).json({
        success: true,
        count: rooms.length,
        data: rooms,
      });
    } catch (error) {
      logger.error("Controller Error: getRoomsByHotel", error);
      next(error);
    }
  }

  public async updateRoomStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const room = await roomService.updateRoomStatus(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: "Room updated successfully",
        data: room,
      });
    } catch (error) {
      logger.error("Controller Error: updateRoomStatus", error);
      next(error);
    }
  }
}
