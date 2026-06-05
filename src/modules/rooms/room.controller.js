const roomService = require("./room.service");
const Vendor = require("../vendors/vendor.model");
const Hotel = require("../hotels/hotel.model");
const logger = require("../../shared/utils/logger");

exports.createRoom = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
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
};

exports.getRoomsByHotel = async (req, res, next) => {
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
};

exports.updateRoomStatus = async (req, res, next) => {
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
};
