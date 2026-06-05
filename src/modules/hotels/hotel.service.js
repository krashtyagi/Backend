const mongoose = require("mongoose");
const cloudinary = require("../../shared/config/cloudinary");
const Vendor = require("../vendors/vendor.model");

const Hotel = require("./hotel.model");
const RoomType = require("../rooms/roomType.model");
const Availability = require("../availability/availability.model");
const Tax = require("../admin/tax/tax.model");

const Booking = require("../bookings/booking.model");
const Favorite = require("../favorites/favorite.model");

const logger = require("../../shared/utils/logger");

//helper function to attach isFavorite flag to hotels
const attachFavoriteFlag = async (hotels, userId) => {
  if (!userId || hotels.length === 0) {
    hotels.forEach((hotel) => (hotel.isFavorite = false));
    return hotels;
  }

  const hotelIds = hotels.map((h) => h._id);

  const favorites = await Favorite.find({
    user: userId,
    itemType: "hotel",
    itemId: { $in: hotelIds },
  }).select("itemId");

  const favoriteSet = new Set(favorites.map((fav) => fav.itemId.toString()));

  hotels.forEach((hotel) => {
    hotel.isFavorite = favoriteSet.has(hotel._id.toString());
  });

  return hotels;
};


exports.createHotel = async (vendor, hotelData) => {
  try {
    if (vendor.isSubmitted && vendor.status !== "rejected") {
      throw new Error("Already submitted. Cannot edit.");
    }

    //STEP VALIDATION
    if (vendor.currentStep !== 3 && vendor.status !== "rejected") {
      throw new Error("Invalid step flow");
    }

    //REJECTION FLOW
    if (vendor.status === "rejected" && vendor.rejectedStep !== 4) {
      throw new Error("Fix required step first");
    }

    //CHECK EXISTING HOTEL
    let hotel = await Hotel.findOne({ vendorId: vendor._id });

    if (hotel) {
      // update existing
      Object.assign(hotel, hotelData);
      hotel.verificationStatus = "pending";
      await hotel.save();
    } else {
      hotel = await Hotel.create({
        ...hotelData,
        vendorId: vendor._id,
        verificationStatus: "pending",
        isActive: false,
      });
    }

    //STEP UPDATE
    vendor.currentStep = 4;
    vendor.registrationStep = Math.max(vendor.registrationStep, 4);

    //reset rejection
    if (vendor.status === "rejected") {
      vendor.status = "draft";
      vendor.rejectedStep = null;
      vendor.adminRemark = null;
    }

    await vendor.save();

    return hotel;
  } catch (error) {
    logger.error("Service Error: createHotel", error);
    throw error;
  }
};


//get all hotels with filters, add rank
exports.getAllHotels = async (query = {}, userId = null) => {
  try {
    const {
      city,
      checkIn,
      checkOut,
      minRating,
      minPrice,
      maxPrice,
      amenities,
      minSize,
      maxSize,
      adults,
      children,
      lat,
      lng,
      maxDistance,
      page = 1,
      limit = 10,
    } = query;

    if (!city) throw new Error("City is required");

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const amenityArray = amenities
      ? Array.isArray(amenities)
        ? amenities
        : amenities.split(",")
      : null;

    let startDate = null;
    let endDate = null;
    let nights = 1;

    if (checkIn && checkOut) {
      startDate = new Date(checkIn);
      endDate = new Date(checkOut);

      startDate.setUTCHours(0, 0, 0, 0);
      endDate.setUTCHours(0, 0, 0, 0);

      nights = Math.max(
        1,
        Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)),
      );
    }

    // WITH DATES
    if (startDate && endDate) {
      const pipeline = [
        {
          $match: {
            isActive: true,
            city: { $regex: city, $options: "i" },
            ...(minRating && { rating: { $gte: Number(minRating) } }),
          },
        },

        ...(lat && lng
          ? [
              {
                $match: {
                  location: {
                    $near: {
                      $geometry: {
                        type: "Point",
                        coordinates: [Number(lng), Number(lat)],
                      },
                      $maxDistance: maxDistance
                        ? Number(maxDistance) * 1000
                        : 100000,
                    },
                  },
                },
              },
            ]
          : []),

        {
          $lookup: {
            from: "roomtypes",
            localField: "_id",
            foreignField: "hotelId",
            as: "roomTypes",
          },
        },

        { $unwind: "$roomTypes" },

        {
          $match: {
            "roomTypes.isActive": true,
            ...(adults && {
              "roomTypes.capacity.adults": { $gte: Number(adults) },
            }),
            ...(children && {
              "roomTypes.capacity.children": { $gte: Number(children) },
            }),
            ...(amenityArray && {
              "roomTypes.amenities": { $all: amenityArray },
            }),
            ...(minSize || maxSize
              ? {
                  "roomTypes.roomSizeSqm": {
                    ...(minSize && { $gte: Number(minSize) }),
                    ...(maxSize && { $lte: Number(maxSize) }),
                  },
                }
              : {}),
          },
        },

        // AVAILABILITY
        {
          $lookup: {
            from: "availabilities",
            let: { roomTypeId: "$roomTypes._id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$roomTypeId", "$$roomTypeId"] },
                  date: { $gte: startDate, $lt: endDate },
                },
              },
            ],
            as: "availabilityData",
          },
        },

        {
          $addFields: {
            minAvailableRooms: {
              $cond: [
                { $gt: [{ $size: "$availabilityData" }, 0] },
                {
                  $min: {
                    $map: {
                      input: "$availabilityData",
                      as: "a",
                      in: {
                        $subtract: [
                          "$roomTypes.totalRooms",
                          {
                            $add: [
                              { $ifNull: ["$$a.bookedRooms", 0] },
                              { $ifNull: ["$$a.blockedRooms", 0] },
                            ],
                          },
                        ],
                      },
                    },
                  },
                },
                "$roomTypes.totalRooms",
              ],
            },
          },
        },

        { $match: { minAvailableRooms: { $gt: 0 } } },

        // PRICE
        {
          $addFields: {
            effectivePrice: {
              $cond: [
                { $gt: ["$roomTypes.discountPrice", 0] },
                "$roomTypes.discountPrice",
                "$roomTypes.basePrice",
              ],
            },
          },
        },

        ...(minPrice || maxPrice
          ? [
              {
                $match: {
                  effectivePrice: {
                    ...(minPrice && { $gte: Number(minPrice) }),
                    ...(maxPrice && { $lte: Number(maxPrice) }),
                  },
                },
              },
            ]
          : []),

        // GROUP
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            city: { $first: "$city" },
            rating: { $first: "$rating" },
            numReviews: { $first: "$numReviews" },
            isFeatured: { $first: "$isFeatured" },
            description: { $first: "$description" },
            amenities: { $first: "$amenities" },
            images: { $first: "$images" },

            //ADD
            rank: { $first: "$rank" },

            startingPrice: { $min: "$effectivePrice" },
            availableRooms: { $min: "$minAvailableRooms" },
          },
        },

        //SAFE FALLBACK
        {
          $addFields: {
            rank: { $ifNull: ["$rank", "C"] },
          },
        },

        {
          $addFields: {
            totalNights: nights,
            totalPrice: { $multiply: ["$startingPrice", nights] },
            thumbnail: { $arrayElemAt: ["$images.url", 0] },
            hotelImages: "$images",
          },
        },

        { $project: { images: 0 } },

        {
          $sort: {
            rank: 1,
            isFeatured: -1,
            rating: -1,
            startingPrice: 1,
          },
        },

        { $skip: skip },
        { $limit: limitNum },
      ];

      const hotels = await Hotel.aggregate(pipeline);
      const updatedHotels = await attachFavoriteFlag(hotels, userId);

      return { hotels: updatedHotels, total: hotels.length };
    }

    //  NO DATES
    const roomTypeFilter = { isActive: true };

    if (adults) roomTypeFilter["capacity.adults"] = { $gte: Number(adults) };
    if (children)
      roomTypeFilter["capacity.children"] = { $gte: Number(children) };

    if (amenityArray) {
      roomTypeFilter.amenities = { $all: amenityArray };
    }

    if (minSize || maxSize) {
      roomTypeFilter.roomSizeSqm = {
        ...(minSize && { $gte: Number(minSize) }),
        ...(maxSize && { $lte: Number(maxSize) }),
      };
    }

    if (minPrice || maxPrice) {
      roomTypeFilter.$or = [
        {
          discountPrice: {
            $gt: 0,
            ...(minPrice && { $gte: Number(minPrice) }),
            ...(maxPrice && { $lte: Number(maxPrice) }),
          },
        },
        {
          discountPrice: 0,
          basePrice: {
            ...(minPrice && { $gte: Number(minPrice) }),
            ...(maxPrice && { $lte: Number(maxPrice) }),
          },
        },
      ];
    }

    const hotelIds = await RoomType.distinct("hotelId", roomTypeFilter);

    if (hotelIds.length === 0) {
      return { hotels: [], total: 0 };
    }

    const hotelFilter = {
      _id: { $in: hotelIds },
      isActive: true,
      city: { $regex: city, $options: "i" },
      ...(minRating && { rating: { $gte: Number(minRating) } }),
    };

    if (amenityArray) {
      hotelFilter.amenities = { $all: amenityArray };
    }

    if (lat && lng) {
      hotelFilter.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: maxDistance ? Number(maxDistance) * 1000 : 100000,
        },
      };
    }

    const [hotels, total] = await Promise.all([
      Hotel.find(hotelFilter)
        .populate("vendorId", "businessName")
        .select(
          "name city rating numReviews isFeatured images description amenities rank",
        )
        .sort({
          rank: 1,
          isFeatured: -1,
          rating: -1,
        })
        .skip(skip)
        .limit(limitNum)
        .lean(),

      Hotel.countDocuments(hotelFilter),
    ]);

    const formattedHotels = hotels.map((h) => ({
      ...h,
      rank: h.rank || "C",
      thumbnail: h.images?.[0]?.url || null,
      hotelImages: h.images || [],
      startingPrice: null,
      availableRooms: null,
      totalNights: 1,
      totalPrice: null,
    }));

    const updatedHotels = await attachFavoriteFlag(formattedHotels, userId);

    return { hotels: updatedHotels, total };
  } catch (error) {
    throw error;
  }
};

//get all hotels with filters, add rank
// exports.getAllHotels = async (query = {}, userId = null) => {
//   try {
//     const {
//       city,
//       checkIn,
//       checkOut,
//       amenities,
//       adults,
//       children,
//       page = 1,
//       limit = 10,
//     } = query;

//     if (!city) throw new Error("City is required");

//     const skip = (page - 1) * limit;

//     // normalize
//     const normalizeAmenity = (a) => a.toLowerCase().replace(/\s+/g, "_").trim();

//     const amenityArray = amenities
//       ? (Array.isArray(amenities) ? amenities : amenities.split(",")).map(
//           normalizeAmenity,
//         )
//       : null;

//     const buildAmenityRegex = (a) => {
//       const regex = new RegExp(`^${a.replace("_", "[_ ]")}$`, "i");
//       return regex;
//     };

//     const regexArray = amenityArray
//       ? amenityArray.map(buildAmenityRegex)
//       : null;

//     if (regexArray) {
//       const testRoom = await RoomType.findOne({
//         amenities: { $in: regexArray },
//       });

//       const testHotel = await Hotel.findOne({
//         amenities: { $in: regexArray },
//       });
//     }

//     // PIPELINE

//     const pipeline = [
//       {
//         $match: {
//           isActive: true,
//           city: { $regex: city, $options: "i" },
//         },
//       },

//       {
//         $lookup: {
//           from: "roomtypes",
//           localField: "_id",
//           foreignField: "hotelId",
//           as: "roomTypes",
//         },
//       },

//       {
//         $addFields: {
//           roomTypesCount: { $size: "$roomTypes" },
//         },
//       },

//       {
//         $match: {
//           ...(regexArray && {
//             $or: [
//               {
//                 amenities: { $in: regexArray },
//               },
//               {
//                 roomTypes: {
//                   $elemMatch: {
//                     amenities: { $in: regexArray },
//                   },
//                 },
//               },
//             ],
//           }),
//         },
//       },

//       { $unwind: "$roomTypes" },

//       {
//         $match: {
//           "roomTypes.isActive": true,

//           ...(adults && {
//             "roomTypes.capacity.adults": { $gte: Number(adults) },
//           }),

//           ...(children && {
//             "roomTypes.capacity.children": { $gte: Number(children) },
//           }),
//         },
//       },

//       {
//         $group: {
//           _id: "$_id",
//           name: { $first: "$name" },
//           amenities: { $first: "$amenities" },
//           roomTypes: { $push: "$roomTypes" },
//         },
//       },
//     ];

//     const hotels = await Hotel.aggregate(pipeline);

//     return {
//       hotels,
//       total: hotels.length,
//     };
//   } catch (error) {
//     console.error("❌ ERROR:", error);
//     throw error;
//   }
// };

//get home hotels
exports.getHomeHotels = async (query = {}, userId = null) => {
  try {
    const { city } = query;

    const filter = {
      isActive: true,
      isFeatured: true,
    };

    if (city) filter.city = city;

    const hotels = await Hotel.find(filter)
      .select("name city images")
      .sort({ rank: 1, rating: -1 })
      .lean();
    // .limit(Number(limit))

    const formattedHotels = hotels.map((hotel) => ({
      _id: hotel._id,
      name: hotel.name,
      city: hotel.city,
      rating: hotel.rating,
      numReviews: hotel.numReviews,
      image: hotel.images?.[0]?.url || null,

      rank: hotel?.rank || "C",
    }));

    return formattedHotels;
  } catch (error) {
    throw error;
  }
};

// Get a single hotel detail by id
exports.getHotelDetails = async (hotelId, userId = null) => {
  const hotel = await Hotel.findOne({
    _id: hotelId,
    isActive: true,
  }).lean();

  if (!hotel) throw new Error("Hotel not found");

  const roomTypes = await RoomType.find({
    hotelId,
    isActive: true,
  }).lean();

  let isFavorite = false;

  if (userId) {
    const favorite = await Favorite.findOne({
      user: userId,
      itemType: "hotel",
      itemId: hotel._id,
    }).select("_id");

    isFavorite = !!favorite;
  }

  return {
    ...hotel,
    isFavorite,
    roomTypes: roomTypes.map((room) => ({
      ...room,
      displayPrice:
        room.discountPrice > 0 ? room.discountPrice : room.basePrice,
    })),
  };
};

// exports.getHotelAvailability = async (
//   hotelId,
//   checkIn,
//   checkOut,
//   adults,
//   children,
// ) => {
//   if (!checkIn || !checkOut) throw new Error("Check-in and check-out required");

//   const startDate = new Date(checkIn);
//   const endDate = new Date(checkOut);

//   startDate.setUTCHours(0, 0, 0, 0);
//   endDate.setUTCHours(0, 0, 0, 0);

//   if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//     throw new Error("Invalid date format");
//   }

//   if (startDate >= endDate) throw new Error("Invalid date range");

//   const nights = (endDate - startDate) / (1000 * 60 * 60 * 24);

//   const hotel = await Hotel.findOne({
//     _id: hotelId,
//     isActive: true,
//   }).lean();

//   if (!hotel) throw new Error("Hotel not found");

//   const roomTypes = await RoomType.find({
//     hotelId,
//     isActive: true,
//   }).lean();

//   if (!roomTypes.length) {
//     return { roomTypes: [] };
//   }

//   const roomTypeIds = roomTypes.map((r) => r._id);

//   const availabilityDocs = await Availability.find({
//     roomTypeId: { $in: roomTypeIds },
//     date: { $gte: startDate, $lt: endDate },
//   }).lean();

//   // Build lookup map
//   const availabilityMap = new Map();

//   for (const doc of availabilityDocs) {
//     const utcDate = new Date(doc.date);
//     utcDate.setUTCHours(0, 0, 0, 0);

//     const dateStr = utcDate.toISOString().slice(0, 10);

//     const mapKey = `${doc.roomTypeId.toString()}_${dateStr}`;

//     console.log("MAP INSERT:", mapKey);

//     availabilityMap.set(mapKey, doc);
//   }

//   const results = [];

//   for (const room of roomTypes) {
//     if (adults || children) {
//       if (
//         room.capacity.adults < adults ||
//         room.capacity.children < (children || 0)
//       ) {
//         continue;
//       }
//     }

//     let minAvailable = room.totalRooms;
//     let totalPrice = 0;
//     let isAvailable = true;

//     for (let i = 0; i < nights; i++) {
//       const currentDate = new Date(startDate);
//       currentDate.setUTCDate(currentDate.getUTCDate() + i);

//       const dateStr = currentDate.toISOString().slice(0, 10);

//       const key = `${room._id.toString()}_${dateStr}`;

//       const dayDoc = availabilityMap.get(key);

//       const booked = dayDoc?.bookedRooms || 0;
//       const blocked = dayDoc?.blockedRooms || 0;

//       const available = room.totalRooms - booked - blocked;

//       if (available < 1) {
//         isAvailable = false;
//         break;
//       }

//       minAvailable = Math.min(minAvailable, available);

//       const price =
//         dayDoc?.priceOverride ??
//         (room.discountPrice > 0 ? room.discountPrice : room.basePrice);

//       console.log("PRICE USED:", price);

//       totalPrice += price;
//     }

//     if (!isAvailable) {
//       console.log("ROOM NOT AVAILABLE");
//       continue;
//     }

//     results.push({
//       ...room,
//       availableRooms: minAvailable,
//       nights,
//       totalPrice,
//     });
//   }

//   return {
//     roomTypes: results,
//   };
// };
// Update hotel details

exports.getHotelAvailability = async (
  hotelId,
  checkIn,
  checkOut,
  adults,
  children,
) => {
  if (!checkIn || !checkOut) throw new Error("Check-in and check-out required");

  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(0, 0, 0, 0);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("Invalid date format");
  }

  if (startDate >= endDate) throw new Error("Invalid date range");

  const nights = (endDate - startDate) / (1000 * 60 * 60 * 24);

  const hotel = await Hotel.findOne({
    _id: hotelId,
    isActive: true,
  }).lean();

  if (!hotel) throw new Error("Hotel not found");

  const roomTypes = await RoomType.find({
    hotelId,
    isActive: true,
  }).lean();

  if (!roomTypes.length) {
    return { roomTypes: [] };
  }

  const taxDoc = await Tax.findOne({ isActive: true }).lean();
  const taxPercentage = taxDoc?.taxPercentage || 0;

  const roomTypeIds = roomTypes.map((r) => r._id);

  const availabilityDocs = await Availability.find({
    roomTypeId: { $in: roomTypeIds },
    date: { $gte: startDate, $lt: endDate },
  }).lean();

  const availabilityMap = new Map();

  for (const doc of availabilityDocs) {
    const utcDate = new Date(doc.date);
    utcDate.setUTCHours(0, 0, 0, 0);

    const dateStr = utcDate.toISOString().slice(0, 10);
    const mapKey = `${doc.roomTypeId.toString()}_${dateStr}`;

    availabilityMap.set(mapKey, doc);
  }

  const results = [];

  for (const room of roomTypes) {
    if (adults || children) {
      if (
        room.capacity.adults < adults ||
        room.capacity.children < (children || 0)
      ) {
        continue;
      }
    }

    let minAvailable = room.totalRooms;
    let totalPrice = 0;
    let isAvailable = true;

    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(startDate.getTime() + i * 86400000);

      const dateStr = currentDate.toISOString().slice(0, 10);
      const key = `${room._id.toString()}_${dateStr}`;

      const dayDoc = availabilityMap.get(key);

      const booked = dayDoc?.bookedRooms || 0;
      const blocked = dayDoc?.blockedRooms || 0;

      const available = room.totalRooms - booked - blocked;

      if (available < 1) {
        isAvailable = false;
        break;
      }

      minAvailable = Math.min(minAvailable, available);

      const price =
        dayDoc?.priceOverride ??
        (room.discountPrice > 0 ? room.discountPrice : room.basePrice);

      totalPrice += price;
    }

    if (!isAvailable) continue;

    //TAX CALCULATION
    const totalTax = Number(((totalPrice * taxPercentage) / 100).toFixed(2));
    const totalPriceWithTax = Number((totalPrice + totalTax).toFixed(2));

    results.push({
      ...room,
      availableRooms: minAvailable,
      nights,

      totalPrice,

      taxPercentage,
      totalTax,
      totalPriceWithTax,
    });
  }

  return {
    roomTypes: results,
  };
};

exports.updateHotel = async (hotelId, vendorId, updateData) => {
  try {
    const existingHotel = await Hotel.findOne({
      _id: hotelId,
      vendorId,
    });

    if (!existingHotel) throw new Error("Hotel not found or unauthorized");

    if (updateData.images && updateData.images.length > 0) {
      if (existingHotel.images?.length > 0) {
        for (const img of existingHotel.images) {
          await cloudinary.uploader.destroy(img.public_id, {
            resource_type: img.resource_type || "image",
          });
        }
      }
    }

    const updatedHotel = await Hotel.findOneAndUpdate(
      { _id: hotelId, vendorId },
      updateData,
      { new: true, runValidators: true },
    );

    return updatedHotel;
  } catch (error) {
    logger.error("Service Error: updateHotel", error);
    throw error;
  }
};

// Find hotels near a specific location (Geospatial Search)
exports.findNearbyHotels = async (lng, lat, maxDistance = 5000) => {
  try {
    return await Hotel.find({
      isActive: true,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: maxDistance,
        },
      },
    })
      .limit(50)
      .lean();
  } catch (error) {
    logger.error("Service Error: findNearbyHotels", error);
    throw error;
  }
};

exports.getSuggestions = async (query) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const results = await Hotel.find(
    {
      $text: { $search: query },
      isActive: true,
    },
    {
      score: { $meta: "textScore" },
      name: 1,
      city: 1,
    },
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(8)
    .lean();

  // Unique city suggestions
  const uniqueCities = [...new Set(results.map((hotel) => hotel.city))].slice(
    0,
    3,
  );

  const citySuggestions = uniqueCities.map((city) => ({
    type: "city",
    value: city,
  }));

  const hotelSuggestions = results.map((hotel) => ({
    type: "hotel",
    id: hotel._id,
    name: hotel.name,
    city: hotel.city,
  }));

  return [...citySuggestions, ...hotelSuggestions];
};

exports.searchHotels = async (query = {}, userId = null) => {
  const {
    destination,
    checkIn,
    checkOut,
    adults = 1,
    children = 0,
    page = 1,
    limit = 10,
  } = query;

  if (!destination) {
    throw new Error("Destination (city) is required");
  }

  const skip = (page - 1) * limit;

  let startDate = null;
  let endDate = null;
  let nights = 1;

  if (checkIn && checkOut) {
    startDate = new Date(checkIn);
    endDate = new Date(checkOut);

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);

    nights = Math.max(
      1,
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)),
    );
  }

  const pipeline = [
    //HOTEL FILTER
    {
      $match: {
        isActive: true,
        city: { $regex: destination, $options: "i" },
      },
    },

    //ROOM TYPES
    {
      $lookup: {
        from: "roomtypes",
        localField: "_id",
        foreignField: "hotelId",
        as: "roomTypes",
      },
    },

    { $unwind: "$roomTypes" },

    {
      $match: {
        "roomTypes.capacity.adults": { $gte: Number(adults) },
        "roomTypes.capacity.children": { $gte: Number(children) },
        "roomTypes.isActive": true,
      },
    },

    //AVAILABILITY (ONLY IF DATES PROVIDED)
    ...(startDate && endDate
      ? [
          {
            $lookup: {
              from: "availabilities",
              let: { roomTypeId: "$roomTypes._id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$roomTypeId", "$$roomTypeId"] },
                    date: { $gte: startDate, $lt: endDate },
                  },
                },
              ],
              as: "availabilityData",
            },
          },

          {
            $addFields: {
              minAvailableRooms: {
                $cond: [
                  { $gt: [{ $size: "$availabilityData" }, 0] },
                  {
                    $min: {
                      $map: {
                        input: "$availabilityData",
                        as: "a",
                        in: {
                          $subtract: [
                            "$roomTypes.totalRooms",
                            {
                              $add: [
                                { $ifNull: ["$$a.bookedRooms", 0] },
                                { $ifNull: ["$$a.blockedRooms", 0] },
                              ],
                            },
                          ],
                        },
                      },
                    },
                  },
                  "$roomTypes.totalRooms",
                ],
              },
            },
          },

          {
            $match: {
              minAvailableRooms: { $gt: 0 },
            },
          },
        ]
      : [
          //NO DATE → assume available
          {
            $addFields: {
              minAvailableRooms: "$roomTypes.totalRooms",
            },
          },
        ]),

    // PRICE
    {
      $addFields: {
        effectivePrice: {
          $cond: [
            { $gt: ["$roomTypes.discountPrice", 0] },
            "$roomTypes.discountPrice",
            "$roomTypes.basePrice",
          ],
        },
      },
    },

    //GROUP
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        city: { $first: "$city" },
        rating: { $first: "$rating" },
        numReviews: { $first: "$numReviews" },
        isFeatured: { $first: "$isFeatured" },
        images: { $first: "$images" },
        startingPrice: { $min: "$effectivePrice" },
        availableRooms: { $min: "$minAvailableRooms" },
      },
    },

    {
      $addFields: {
        totalNights: nights,
        totalPrice: { $multiply: ["$startingPrice", nights] },
        thumbnail: { $arrayElemAt: ["$images.url", 0] },
      },
    },

    {
      $project: {
        images: 0,
      },
    },

    { $sort: { isFeatured: -1, rating: -1 } },
    { $skip: skip },
    { $limit: Number(limit) },
  ];

  const hotels = await Hotel.aggregate(pipeline);
  const updatedHotels = await attachFavoriteFlag(hotels, userId);

  return updatedHotels;
};
