const mongoose = require("mongoose");
const Booking = require("../bookings/booking.model");
const Hotel = require("../hotels/hotel.model");
const Availability = require("../availability/availability.model");
const RoomType = require("./roomType.model");
const logger = require("../../shared/utils/logger");
const cloudinary = require("../../shared/config/cloudinary");

exports.createRoomType = async (data) => {
  try {
    return await RoomType.create(data);
  } catch (error) {
    logger.error("Service Error: createRoomType", error);
    throw error;
  }
};

exports.getRoomTypesByHotel = async (hotelId) => {
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

exports.updateRoomType = async (roomTypeId, hotelId, updateData) => {
  try {
    const existingRoomType = await RoomType.findOne({
      _id: roomTypeId,
      hotelId,
    });

    if (!existingRoomType)
      throw new Error("Room type not found or unauthorized");

    if (updateData.images && updateData.images.length > 0) {
      if (existingRoomType.images?.length > 0) {
        for (const img of existingRoomType.images) {
          await cloudinary.uploader.destroy(img.public_id, {
            resource_type: img.resource_type || "image",
          });
        }
      }
    }

    const updatedRoomType = await RoomType.findOneAndUpdate(
      { _id: roomTypeId, hotelId },
      updateData,
      { new: true, runValidators: true },
    );

    return updatedRoomType;
  } catch (error) {
    logger.error("Service Error: updateRoomType", error);
    throw error;
  }
};


//get booking detail in dashboard-vendor
exports.getVendorBookingDetail = async (bookingId, vendorId) => {
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

  return {
    bookingReference: booking.bookingReference,
    status: booking.status,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    nights: booking.nights,
    guests: booking.guests,
    specialRequest: booking.specialRequest || null,

    primaryGuest: {
      firstName: booking.primaryGuest.firstName,
      lastName: booking.primaryGuest.lastName,
      email: booking.primaryGuest.email,
      phoneNumber: booking.primaryGuest.phoneNumber,
    },

    room: {
      roomType: booking.roomTypeId?.name || null,
      roomNumber: booking.roomNumber,
      image: booking.roomTypeId?.images?.[0]?.url || null,
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

//get room type in dashboard-vendor
exports.getVendorRoomTypes = async (vendorId, queryParams) => {
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

  const skip = (page - 1) * limit;

  const filter = { hotelId };

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const roomTypes = await RoomType.find(filter)
    .select(
      "name basePrice discountPrice capacity roomSizeSqm beds totalRooms images"
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

  const availabilityMap = {};
  availabilityData.forEach(a => {
    availabilityMap[a._id.toString()] = a;
  });

  const formatted = roomTypes.map(rt => {
    const availability = availabilityMap[rt._id.toString()];
    const booked = availability?.booked || 0;
    const blocked = availability?.blocked || 0;
    const available = rt.totalRooms - booked - blocked;

    return {
      id: rt._id,
      name: rt.name,
      price: rt.discountPrice > 0 ? rt.discountPrice : rt.basePrice,
      capacity: rt.capacity,
      roomSizeSqm: rt.roomSizeSqm,
      beds: rt.beds,
      totalRooms: rt.totalRooms,
      availableRooms: available,
      status: available > 0 ? "available" : "occupied",
      image: rt.images?.[0]?.url || null,
    };
  });

  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    count: formatted.length,
    data: formatted,
  };
};


exports.getVendorRoomTypeDetail = async (roomTypeId, vendorId) => {
  if (!mongoose.Types.ObjectId.isValid(roomTypeId)) {
    throw new Error("Invalid roomType id");
  }

  const roomType = await RoomType.findById(roomTypeId)
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

  return {
    id: roomType._id,
    name: roomType.name,
    description: roomType.description,
    price: roomType.discountPrice > 0
      ? roomType.discountPrice
      : roomType.basePrice,
    basePrice: roomType.basePrice,
    discountPrice: roomType.discountPrice,
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

exports.deleteRoomType = async (roomTypeId, vendorId) => {
  const roomType = await RoomType.findById(roomTypeId);
  if (!roomType) throw new Error("Room type not found");

  const hotel = await Hotel.findOne({ _id: roomType.hotelId, vendorId });
  if (!hotel) throw new Error("Unauthorized room type access");

  if (roomType.images?.length > 0) {
    for (const img of roomType.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id, {
          resource_type: img.resource_type || "image",
        });
      }
    }
  }

  const Room = require("./room.model");
  await Room.deleteMany({ roomTypeId });
  await Availability.deleteMany({ roomTypeId });
  await RoomType.findByIdAndDelete(roomTypeId);
};