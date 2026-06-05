const Room = require("./room.model");
const logger = require("../../shared/utils/logger");
const mongoose = require("mongoose");

//Create a new room type for a specific hotel
exports.createRoom = async (roomData) => {
  try {
    return await Room.create(roomData);
  } catch (error) {
    logger.error("Service Error: createRoom", error);
    throw error;
  }
};

//Get all rooms belonging to a specific hotel
exports.getRoomsByHotel = async (hotelId) => {
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
exports.getRoomById = async (id) => {
  try {
    const room = await Room.findById(id).lean();
    if (!room) throw new Error("Room type not found");
    return room;
  } catch (error) {
    logger.error("Service Error: getRoomById", error);
    throw error;
  }
};

//Update room status
exports.updateRoomStatus = async (roomId, updateData) => {
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
