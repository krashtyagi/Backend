import mongoose from "mongoose";

import Vendor from "../vendors/vendor.model.js";
import Availability from "./availability.model.js";
import Hotel from "../hotels/hotel.model.js";
import RoomType from "../rooms/roomType.model.js";

import logger from "../../shared/utils/logger.js";

// Create / Update availability for a date
export const upsertAvailability = async (data: any) => {
  try {
    const { roomTypeId, date, availableRooms, priceOverride } = data;

    return await Availability.findOneAndUpdate(
      { roomTypeId, date },
      {
        $set: {
          availableRooms,
          ...(priceOverride !== undefined && { priceOverride }),
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );
  } catch (error) {
    logger.error("Service Error: upsertAvailability", error);
    throw error;
  }
};

// Get availability for date range (User side)
export const getAvailabilityForRange = async (
  roomTypeId: any,
  startDate: any,
  endDate: any,
) => {
  if (!mongoose.Types.ObjectId.isValid(roomTypeId)) {
    throw new Error("Invalid roomType id");
  }

  try {
    return await Availability.find({
      roomTypeId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).lean();
  } catch (error) {
    logger.error("Service Error: getAvailabilityForRange", error);
    throw error;
  }
};

// Atomic decrement (Booking time)
export const decreaseAvailability = async (
  roomTypeId: any,
  date: any,
  qty: any = 1,
) => {
  try {
    const result = await Availability.findOneAndUpdate(
      {
        roomTypeId,
        date,
        availableRooms: { $gte: qty },
      },
      {
        $inc: { availableRooms: -qty },
      },
      { new: true },
    );

    if (!result) {
      throw new Error("Rooms not available for selected date");
    }

    return result;
  } catch (error) {
    logger.error("Service Error: decreaseAvailability", error);
    throw error;
  }
};

// get room type
export const getVendorRoomTypes = async (userId: any, hotelId: any) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      throw new Error("Invalid hotel ID");
    }

    const vendor = await Vendor.findOne({ userId }).lean();
    if (!vendor) {
      throw new Error("Vendor not found");
    }

    const hotel = await Hotel.findOne({
      _id: hotelId,
      vendorId: vendor._id,
      isActive: true,
    }).lean();

    if (!hotel) {
      throw new Error("Hotel not found or not authorized");
    }

    const roomTypes = await RoomType.find({
      hotelId,
      isActive: true,
    })
      .select("_id name basePrice discountPrice totalRooms")
      .sort({ createdAt: 1 })
      .lean();

    return roomTypes;
  } catch (error) {
    logger.error("Service Error: getVendorRoomTypes", error);
    throw error;
  }
};

// room type calender data return
export const getRoomTypeCalendar = async (
  userId: any,
  roomTypeId: any,
  month: number,
  year: number,
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(roomTypeId)) {
      throw new Error("Invalid room type ID");
    }

    if (!month || !year) {
      throw new Error("Month and year are required");
    }

    const vendor = await Vendor.findOne({ userId }).lean();
    if (!vendor) {
      throw new Error("Vendor not found");
    }

    const roomType: any = await RoomType.findById(roomTypeId).lean();
    if (!roomType || !roomType.isActive) {
      throw new Error("Room type not found");
    }

    const hotel = await Hotel.findOne({
      _id: roomType.hotelId,
      vendorId: vendor._id,
      isActive: true,
    }).lean();

    if (!hotel) {
      throw new Error("Not authorized");
    }

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));

    const availabilityDocs = await Availability.find({
      roomTypeId,
      date: { $gte: startDate, $lt: endDate },
    }).lean();

    const availabilityMap: Record<string, any> = {};

    for (const doc of availabilityDocs) {
      const d = new Date(doc.date);
      const dateStr = d.toISOString().split("T")[0];
      availabilityMap[dateStr] = doc;
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    const calendar = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(Date.UTC(year, month - 1, day));
      const dateStr = currentDate.toISOString().split("T")[0];

      const dayData = availabilityMap[dateStr];

      const bookedRooms = dayData?.bookedRooms || 0;
      const blockedRooms = dayData?.blockedRooms || 0;

      const availableRooms = roomType.totalRooms - bookedRooms - blockedRooms;

      const price =
        dayData?.priceOverride ??
        (roomType.discountPrice && roomType.discountPrice > 0
          ? roomType.discountPrice
          : roomType.basePrice);

      calendar.push({
        date: dateStr,
        availableRooms: Math.max(availableRooms, 0),
        bookedRooms,
        blockedRooms,
        price,
      });
    }

    return {
      roomTypeId,
      roomName: roomType.name,
      totalRooms: roomType.totalRooms,
      calendar,
    };
  } catch (error) {
    logger.error("Service Error: getRoomTypeCalendar", error);
    throw error;
  }
};

// //price and date over-ride

export const updateRoomTypeCalendar = async (
  userId: any,
  roomTypeId: any,
  date: any,
  blockedRooms?: any,
  priceOverride?: any,
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(roomTypeId)) {
      throw new Error("Invalid room type ID");
    }

    if (!date) throw new Error("Date is required");

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
      throw new Error("Vendor not found");
    }

    const roomType: any = await RoomType.findById(roomTypeId);
    if (!roomType || !roomType.isActive) {
      throw new Error("Room type not found");
    }

    const hotel = await Hotel.findOne({
      _id: roomType.hotelId,
      vendorId: vendor._id,
      isActive: true,
    });

    if (!hotel) {
      throw new Error("Not authorized");
    }

    // UTC SAFE DATE RANGE
    const parsedDate = new Date(date);

    const start = new Date(
      Date.UTC(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate(),
        0,
        0,
        0,
        0,
      ),
    );

    const end = new Date(
      Date.UTC(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate(),
        23,
        59,
        59,
        999,
      ),
    );

    if (isNaN(start.getTime())) {
      throw new Error("Invalid date");
    }

    if (blockedRooms !== undefined) {
      if (blockedRooms < 0 || blockedRooms > roomType.totalRooms) {
        throw new Error("Invalid blocked rooms value");
      }
    }

    const updateData: any = {};

    if (blockedRooms !== undefined) {
      updateData.blockedRooms = blockedRooms;
    }

    if (priceOverride !== undefined) {
      updateData.priceOverride = priceOverride;
    }

    // UPSERT AVAILABILITY
    const availability: any = await Availability.findOneAndUpdate(
      {
        roomTypeId,
        date: { $gte: start, $lte: end },
      },
      {
        $set: updateData,
        $setOnInsert: {
          roomTypeId,
          date: start,
          bookedRooms: 0,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    // CALCULATION
    const availableRooms =
      roomType.totalRooms -
      (availability.bookedRooms || 0) -
      (availability.blockedRooms || 0);

    const price =
      availability.priceOverride ??
      (roomType.discountPrice && roomType.discountPrice > 0
        ? roomType.discountPrice
        : roomType.basePrice);

    return {
      date: start.toISOString().split("T")[0],
      availableRooms: Math.max(availableRooms, 0),
      bookedRooms: availability.bookedRooms || 0,
      blockedRooms: availability.blockedRooms || 0,
      price,
    };
  } catch (error) {
    logger.error("Service Error: updateRoomTypeCalendar", error);
    throw error;
  }
};

export const resetRoomTypeCalendar = async (
  vendorId: any,
  roomTypeId: any,
  date: any,
) => {
  try {
    if (!date) {
      throw new Error("Date is required");
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    if (isNaN(targetDate.getTime())) {
      throw new Error("Invalid date");
    }

    const roomType: any = await RoomType.findById(roomTypeId);

    if (!roomType || !roomType.isActive) {
      throw new Error("Room type not found");
    }

    const hotel = await Hotel.findOne({
      _id: roomType.hotelId,
      vendorId,
      isActive: true,
    });

    if (!hotel) {
      throw new Error("Not authorized");
    }

    await Availability.deleteOne({
      roomTypeId,
      date: targetDate,
    });

    const price =
      roomType.discountPrice && roomType.discountPrice > 0
        ? roomType.discountPrice
        : roomType.basePrice;

    return {
      date: targetDate.toISOString().split("T")[0],
      availableRooms: roomType.totalRooms,
      bookedRooms: 0,
      blockedRooms: 0,
      price,
    };
  } catch (error) {
    logger.error("Service Error: resetRoomTypeCalendar", error);
    throw error;
  }
};

export class AvailabilityService {
  async upsertAvailability(data: any) {
    return upsertAvailability(data);
  }

  async getAvailabilityForRange(roomTypeId: any, startDate: any, endDate: any) {
    return getAvailabilityForRange(roomTypeId, startDate, endDate);
  }

  async decreaseAvailability(roomTypeId: any, date: any, qty: any = 1) {
    return decreaseAvailability(roomTypeId, date, qty);
  }

  async getVendorRoomTypes(userId: any, hotelId: any) {
    return getVendorRoomTypes(userId, hotelId);
  }

  async getRoomTypeCalendar(
    userId: any,
    roomTypeId: any,
    month: number,
    year: number,
  ) {
    return getRoomTypeCalendar(userId, roomTypeId, month, year);
  }

  async updateRoomTypeCalendar(
    userId: any,
    roomTypeId: any,
    date: any,
    blockedRooms?: any,
    priceOverride?: any,
  ) {
    return updateRoomTypeCalendar(
      userId,
      roomTypeId,
      date,
      blockedRooms,
      priceOverride,
    );
  }

  async resetRoomTypeCalendar(vendorId: any, roomTypeId: any, date: any) {
    return resetRoomTypeCalendar(vendorId, roomTypeId, date);
  }
}

export const availabilityService = new AvailabilityService();

export default availabilityService;

