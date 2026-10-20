import mongoose from "mongoose";
import Booking from "../bookings/booking.model.js";
import Hotel from "../hotels/hotel.model.js";
import Availability from "../availability/availability.model.js";
import RoomType from "./roomType.model.js";
import Room from "./room.model.js";
import { syncRoomsForRoomType } from "./room.service.js";
import logger from "../../shared/utils/logger.js";
import cloudinary from "../../shared/config/cloudinary.js";

export const createRoomType = async (data: any) => {
  try {
    return await RoomType.create(data);
  } catch (error) {
    logger.error("Service Error: createRoomType", error);
    throw error;
  }
};

export const getRoomTypesByHotel = async (hotelId: any) => {
  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    throw new Error("Invalid hotel id");
  }

  try {
    return await RoomType.find({
      hotelId,
      isActive: true,
    }).lean();
  } catch (error) {
    logger.error("Service Error: getRoomTypesByHotel", error);
    throw error;
  }
};

export const updateRoomType = async (roomTypeId: any, hotelId: any, updateData: any) => {
  try {
    const existingRoomType = await RoomType.findOne({
      _id: roomTypeId,
      hotelId,
    });

    if (!existingRoomType)
      throw new Error("Room type not found or unauthorized");

    if (updateData.images && Array.isArray(updateData.images)) {
      if (existingRoomType.images && existingRoomType.images.length > 0) {
        const remainingPublicIds = new Set(
          updateData.images.map((img: any) => img.public_id).filter(Boolean)
        );
        for (const img of existingRoomType.images) {
          if (img.public_id && !remainingPublicIds.has(img.public_id)) {
            try {
              await cloudinary.uploader.destroy(img.public_id, {
                resource_type: (img as any).resource_type || "image",
              });
            } catch (destroyErr) {
              logger.warn("Could not delete removed room image", destroyErr);
            }
          }
        }
      }
    }

    const updatedRoomType = await RoomType.findOneAndUpdate(
      { _id: roomTypeId, hotelId },
      updateData,
      { new: true, runValidators: true },
    );

    if (updateData.totalRooms && Number(updateData.totalRooms) > 0) {
      try {
        await syncRoomsForRoomType(hotelId, roomTypeId, Number(updateData.totalRooms));
      } catch (err) {
        logger.error("Error syncing rooms after updateRoomType:", err);
      }
    }

    return updatedRoomType;
  } catch (error) {
    logger.error("Service Error: updateRoomType", error);
    throw error;
  }
};

// get booking detail in dashboard-vendor
export const getVendorBookingDetail = async (bookingId: any, vendorId: any) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new Error("Invalid booking id");
  }

  const hotels = await Hotel.find({ vendorId }, "_id").lean();
  const hotelIds = hotels.map((h) => h._id);

  const booking = await Booking.findOne({
    _id: bookingId,
    hotelId: { $in: hotelIds },
  })
    .select(
      `
      bookingReference
      primaryGuest
      guests
      roomTypeId
      roomNumber
      checkIn
      checkOut
      nights
      specialRequest
      status
      pricePerNight
      taxAmount
      cleaningFee
      discountAmount
      totalAmount
      paymentStatus
      `
    )
    .populate("roomTypeId", "name images")
    .lean();

  if (!booking) {
    throw new Error("Booking not found or unauthorized");
  }

  const populatedRoomType = booking.roomTypeId as any;

  return {
    bookingReference: booking.bookingReference,
    status: booking.status,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    nights: booking.nights,
    guests: booking.guests,
    specialRequest: booking.specialRequest || null,

    primaryGuest: {
      firstName: booking.primaryGuest?.firstName,
      lastName: booking.primaryGuest?.lastName,
      email: booking.primaryGuest?.email,
      phoneNumber: booking.primaryGuest?.phoneNumber,
    },

    room: {
      roomType: populatedRoomType?.name || null,
      roomNumber: booking.roomNumber,
      image: populatedRoomType?.images?.[0]?.url || null,
    },

    priceSummary: {
      pricePerNight: booking.pricePerNight,
      taxAmount: booking.taxAmount,
      cleaningFee: booking.cleaningFee,
      discountAmount: booking.discountAmount,
      totalAmount: booking.totalAmount,
      paymentStatus: booking.paymentStatus,
    },
  };
};

// get room type in dashboard-vendor
export const getVendorRoomTypes = async (vendorId: any, queryParams: any = {}) => {
  const {
    hotelId,
    page = 1,
    limit = 10,
    search,
  } = queryParams;

  if (!hotelId || !mongoose.Types.ObjectId.isValid(hotelId)) {
    throw new Error("Valid hotelId is required");
  }

  const hotel = await Hotel.findOne({ _id: hotelId, vendorId }).lean();
  if (!hotel) {
    throw new Error("Unauthorized hotel access");
  }

  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = { hotelId };

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const roomTypes = await RoomType.find(filter)
    .select(
      "name basePrice discountPrice capacity roomSizeSqm beds totalRooms images amenities description viewType isActive"
    )
    .sort("-createdAt")
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const total = await RoomType.countDocuments(filter);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const availabilityData = await Availability.aggregate([
    {
      $match: {
        roomTypeId: { $in: roomTypes.map(r => r._id) },
        date: today,
      },
    },
    {
      $group: {
        _id: "$roomTypeId",
        booked: { $sum: "$bookedRooms" },
        blocked: { $sum: "$blockedRooms" },
      },
    },
  ]);

  const availabilityMap: Record<string, any> = {};
  availabilityData.forEach((a: any) => {
    availabilityMap[a._id.toString()] = a;
  });

  const formatted = roomTypes.map((rt: any) => {
    const availability = availabilityMap[rt._id.toString()];
    const booked = availability?.booked || 0;
    const blocked = availability?.blocked || 0;
    const available = rt.totalRooms - booked - blocked;
    const discountPrice = rt.discountPrice || 0;
    const basePrice = rt.basePrice || 0;

    return {
      id: rt._id,
      name: rt.name,
      description: rt.description || "",
      basePrice,
      discountPrice,
      effectivePrice: discountPrice > 0 ? discountPrice : basePrice,
      price: discountPrice > 0 ? discountPrice : basePrice,
      capacity: rt.capacity,
      roomSizeSqm: rt.roomSizeSqm,
      beds: rt.beds || [],
      totalRooms: rt.totalRooms,
      availableRooms: available,
      status: available > 0 ? "available" : "occupied",
      isActive: rt.isActive !== false,
      viewType: rt.viewType || "none",
      amenities: rt.amenities || [],
      images: rt.images || [],
      image: rt.images?.[0]?.url || null,
    };
  });

  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    count: formatted.length,
    data: formatted,
  };
};

export const getVendorRoomTypeDetail = async (roomTypeId: any, vendorId: any) => {
  if (!mongoose.Types.ObjectId.isValid(roomTypeId)) {
    throw new Error("Invalid roomType id");
  }

  const roomType: any = await RoomType.findById(roomTypeId)
    .select(
      `
      hotelId
      name
      description
      basePrice
      discountPrice
      capacity
      beds
      roomSizeSqm
      amenities
      images
      totalRooms
      `
    )
    .lean();

  if (!roomType) {
    throw new Error("Room type not found");
  }

  const hotel = await Hotel.findOne({
    _id: roomType.hotelId,
    vendorId,
  }).lean();

  if (!hotel) {
    throw new Error("Unauthorized access");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const availability = await Availability.findOne({
    roomTypeId,
    date: today,
  }).lean();

  const booked = availability?.bookedRooms || 0;
  const blocked = availability?.blockedRooms || 0;
  const available = roomType.totalRooms - booked - blocked;
  const discountPrice = roomType.discountPrice || 0;
  const basePrice = roomType.basePrice || 0;

  return {
    id: roomType._id,
    name: roomType.name,
    description: roomType.description,
    price: discountPrice > 0 ? discountPrice : basePrice,
    basePrice,
    discountPrice,
    capacity: roomType.capacity,
    beds: roomType.beds,
    roomSizeSqm: roomType.roomSizeSqm,
    totalRooms: roomType.totalRooms,
    availableRooms: available,
    occupiedRooms: booked,
    status: available > 0 ? "available" : "occupied",
    amenities: roomType.amenities,
    images: roomType.images || [],
  };
};

export const deleteRoomType = async (roomTypeId: any, vendorId: any) => {
  const roomType = await RoomType.findById(roomTypeId);
  if (!roomType) throw new Error("Room type not found");

  const hotel = await Hotel.findOne({ _id: roomType.hotelId, vendorId });
  if (!hotel) throw new Error("Unauthorized room type access");

  if (roomType.images && roomType.images.length > 0) {
    for (const img of roomType.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id, {
          resource_type: (img as any).resource_type || "image",
        });
      }
    }
  }

  await Room.deleteMany({ roomTypeId });
  await Availability.deleteMany({ roomTypeId });
  await RoomType.findByIdAndDelete(roomTypeId);
};

export class RoomTypeService {
  async createRoomType(data: any) {
    return createRoomType(data);
  }

  async getRoomTypesByHotel(hotelId: any) {
    return getRoomTypesByHotel(hotelId);
  }

  async updateRoomType(roomTypeId: any, hotelId: any, updateData: any) {
    return updateRoomType(roomTypeId, hotelId, updateData);
  }

  async getVendorBookingDetail(bookingId: any, vendorId: any) {
    return getVendorBookingDetail(bookingId, vendorId);
  }

  async getVendorRoomTypes(vendorId: any, queryParams: any = {}) {
    return getVendorRoomTypes(vendorId, queryParams);
  }

  async getVendorRoomTypeDetail(roomTypeId: any, vendorId: any) {
    return getVendorRoomTypeDetail(roomTypeId, vendorId);
  }

  async deleteRoomType(roomTypeId: any, vendorId: any) {
    return deleteRoomType(roomTypeId, vendorId);
  }
}

export const roomTypeService = new RoomTypeService();

export default roomTypeService;

