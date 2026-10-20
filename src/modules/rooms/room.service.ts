import Room from "./room.model.js";
import RoomType from "./roomType.model.js";
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

// Synchronize physical Room documents with RoomType.totalRooms
export const syncRoomsForRoomType = async (
  hotelId: any,
  roomTypeId: any,
  targetTotal: number,
) => {
  if (!targetTotal || targetTotal < 1) return;

  const existingRooms = await Room.find({ hotelId, roomTypeId })
    .sort({ roomNumber: 1 })
    .lean();
  const currentCount = existingRooms.length;

  if (targetTotal > currentCount) {
    const toAdd = targetTotal - currentCount;
    let highestNumber = 100;
    for (const r of existingRooms) {
      const num = parseInt(r.roomNumber, 10);
      if (!isNaN(num) && num > highestNumber) {
        highestNumber = num;
      }
    }

    const newRooms = [];
    for (let i = 1; i <= toAdd; i++) {
      const roomNum = highestNumber + i;
      newRooms.push({
        hotelId,
        roomTypeId,
        roomNumber: roomNum.toString(),
        floor: Math.ceil(roomNum / 100) || 1,
        status: "available",
        isActive: true,
      });
    }
    await Room.insertMany(newRooms);
  } else if (targetTotal < currentCount) {
    const toRemove = currentCount - targetTotal;
    const candidateRooms = await Room.find({
      hotelId,
      roomTypeId,
      status: "available",
    })
      .sort({ roomNumber: -1 })
      .limit(toRemove)
      .lean();

    const idsToDelete = candidateRooms.map((r) => r._id);
    if (idsToDelete.length > 0) {
      await Room.deleteMany({ _id: { $in: idsToDelete } });
    }
  }
};

// Synchronize all room types for a hotel
export const syncAllRoomsForHotel = async (hotelId: any) => {
  try {
    const roomTypes = await RoomType.find({ hotelId, isActive: true }).lean();
    for (const rt of roomTypes) {
      if (rt.totalRooms && rt.totalRooms > 0) {
        await syncRoomsForRoomType(hotelId, rt._id, rt.totalRooms);
      }
    }
  } catch (err) {
    logger.error("Error in syncAllRoomsForHotel:", err);
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

  async syncRoomsForRoomType(hotelId: any, roomTypeId: any, targetTotal: number) {
    return syncRoomsForRoomType(hotelId, roomTypeId, targetTotal);
  }

  async syncAllRoomsForHotel(hotelId: any) {
    return syncAllRoomsForHotel(hotelId);
  }
}

export const roomService = new RoomService();

export default roomService;

