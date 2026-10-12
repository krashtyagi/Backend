import Room from "./room.model.js";
import logger from "../../shared/utils/logger.js";
import mongoose from "mongoose";

// Create a new room for a specific hotel
export const createRoom = async (roomData: any) => {
  try {
    return await Room.create(roomData);
  } catch (error) {
    logger.error("Service Error: createRoom", error);
    throw error;
  }
};

// Get all rooms belonging to a specific hotel
export const getRoomsByHotel = async (hotelId: any) => {
  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    throw new Error("Invalid hotel id");
  }

  try {
    return await Room.find({ hotelId, isActive: true })
      .populate("roomTypeId", "name")
      .lean();
  } catch (error) {
    logger.error("Service Error: getRoomsByHotel", error);
    throw error;
  }
};

// Get a single room detail by ID
export const getRoomById = async (id: any) => {
  try {
    const room = await Room.findById(id).lean();
    if (!room) throw new Error("Room not found");
    return room;
  } catch (error) {
    logger.error("Service Error: getRoomById", error);
    throw error;
  }
};

// Update room status
export const updateRoomStatus = async (roomId: any, updateData: any) => {
  try {
    const room = await Room.findByIdAndUpdate(roomId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!room) throw new Error("Room not found");

    return room;
  } catch (error) {
    logger.error("Service Error: updateRoomStatus", error);
    throw error;
  }
};

export class RoomService {
  async createRoom(roomData: any) {
    return createRoom(roomData);
  }

  async getRoomsByHotel(hotelId: any) {
    return getRoomsByHotel(hotelId);
  }

  async getRoomById(id: any) {
    return getRoomById(id);
  }

  async updateRoomStatus(roomId: any, updateData: any) {
    return updateRoomStatus(roomId, updateData);
  }
}

export const roomService = new RoomService();

export default roomService;

