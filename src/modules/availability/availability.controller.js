const availabilityService = require("./availability.service");
const Vendor = require("../vendors/vendor.model");
const RoomType = require("../rooms/roomType.model");
const Hotel = require("../hotels/hotel.model");
const logger = require("../../shared/utils/logger");

//Vendor: Set availability for a date
exports.setAvailability = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
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
};

//User: Get availability calendar
exports.getAvailability = async (req, res, next) => {
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
};

//Get vendor room types
exports.getVendorRoomTypes = async (req, res, next) => {
  try {
    const userId = req.user._id;
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
};

//room tpye calender data return
exports.getRoomTypeCalendar = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { roomTypeId } = req.params;
    let { month, year } = req.query;

    const now = new Date();

    month = month ? Number(month) : now.getMonth() + 1;
    year = year ? Number(year) : now.getFullYear();

    const calendar = await availabilityService.getRoomTypeCalendar(
      userId,
      roomTypeId,
      month,
      year,
    );

    res.status(200).json({
      success: true,
      data: calendar,
    });
  } catch (error) {
    logger.error("Controller Error: getRoomTypeCalendar", error);
    next(error);
  }
};

//date and price over-ride for perticular date
exports.updateRoomTypeCalendar = async (req, res, next) => {
  try {
    const userId = req.user._id;
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
};

exports.resetRoomTypeCalendar = async (req, res, next) => {
  try {
    const vendorId = req.user._id;
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
};
