import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Vendor from "../vendors/vendor.model";
import Hotel from "../hotels/hotel.model";
import roomTypeService from "./roomType.service";
import RoomType from "./roomType.model";
import Room from "./room.model";
import logger from "src/shared/utils/logger";

export class RoomTypeController {
  public async createRoomType(
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

      const roomType = await roomTypeService.createRoomType(req.body);

      res.status(201).json({
        success: true,
        message: "Room type created successfully",
        data: roomType,
      });
    } catch (error) {
      logger.error("Controller Error: createRoomType", error);
      next(error);
    }
  }

  //roomtype create also rooms create
  public async createRoomTypeWithAutoRooms(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });
      if (!vendor) throw new Error("Vendor profile not found");

      const hotel = await Hotel.findOne({
        _id: req.body.hotelId,
        vendorId: vendor._id,
      });

      if (!hotel) throw new Error("Unauthorized hotel access");

      const { totalRooms, ...roomTypeData } = req.body;

      if (!totalRooms || totalRooms < 1) {
        throw new Error("totalRooms must be at least 1");
      }

      roomTypeData.totalRooms = totalRooms;

      const roomType = new RoomType(roomTypeData);
      await roomType.save({ session });

      //auto generate Rooms
      const rooms = [];

      for (let i = 1; i <= totalRooms; i++) {
        rooms.push({
          hotelId: roomTypeData.hotelId,
          roomTypeId: roomType._id,
          roomNumber: (100 + i).toString(),
          floor: Math.ceil(i / 10),
        });
      }

      await Room.insertMany(rooms, { session });

      //hotel active
      await Hotel.findByIdAndUpdate(
        hotel._id,
        {
          isActive: true,
          isFeatured: true,
        },
        { session, new: true },
      );

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        success: true,
        message: "RoomType + Auto Rooms created successfully",
        data: {
          roomType,
          roomsCreated: rooms.length,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      next(error);
    }
  }

  public async getRoomTypesByHotel(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const roomTypes = await roomTypeService.getRoomTypesByHotel(
        req.params.hotelId,
      );

      res.status(200).json({
        success: true,
        count: roomTypes.length,
        data: roomTypes,
      });
    } catch (error) {
      logger.error("Controller Error: getRoomTypesByHotel", error);
      next(error);
    }
  }

  public async updateRoomType(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });
      if (!vendor) throw new Error("Vendor profile not found");

      const roomType = await roomTypeService.updateRoomType(
        req.params.id,
        req.body.hotelId,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: "Room type updated successfully",
        data: roomType,
      });
    } catch (error) {
      logger.error("Controller Error: updateRoomType", error);
      next(error);
    }
  }

  public async deleteRoomType(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });
      if (!vendor) throw new Error("Vendor profile not found");

      await roomTypeService.deleteRoomType(req.params.id, vendor._id);

      res.status(200).json({
        success: true,
        message: "Room type deleted successfully",
      });
    } catch (error) {
      logger.error("Controller Error: deleteRoomType", error);
      next(error);
    }
  }
}
