const mongoose = require("mongoose");
const roomTypeService = require("./roomType.service");
const Vendor = require("../vendors/vendor.model");
const Hotel = require("../hotels/hotel.model");
const RoomType = require("./roomType.model");
const Room = require("../rooms/room.model");
const logger = require("../../shared/utils/logger");

exports.createRoomType = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
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
};

//roomtype create also rooms create
exports.createRoomTypeWithAutoRooms = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
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
};

exports.getRoomTypesByHotel = async (req, res, next) => {
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
};

exports.updateRoomType = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
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
};

exports.deleteRoomType = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
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
};
