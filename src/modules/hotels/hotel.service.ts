import mongoose from "mongoose";
import cloudinary from "../../shared/config/cloudinary.js";
import Vendor from "../vendors/vendor.model.js";
import Hotel from "./hotel.model.js";
import RoomType from "../rooms/roomType.model.js";
import Availability from "../availability/availability.model.js";
import Tax from "../admin/tax/tax.model.js";
import Booking from "../bookings/booking.model.js";
import Favorite from "../favorites/favorite.model.js";
import Review from "../reviews/review.model.js";
import logger from "../../shared/utils/logger.js";

// helper function to attach isFavorite flag to hotels
const attachFavoriteFlag = async (hotels: any[], userId: any) => {
  if (!userId || hotels.length === 0) {
    hotels.forEach((hotel: any) => (hotel.isFavorite = false));
    return hotels;
  }

  const hotelIds = hotels.map((h: any) => h._id);

  const favorites = await Favorite.find({
    user: userId,
    itemType: "hotel",
    itemId: { $in: hotelIds },
  }).select("itemId");

  const favoriteSet = new Set(favorites.map((fav) => fav.itemId.toString()));

  hotels.forEach((hotel: any) => {
    hotel.isFavorite = favoriteSet.has(hotel._id.toString());
  });

  return hotels;
};


export const createHotel = async (vendor: any, hotelData: any) => {
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

    // Normalize rich address payload
    const city = (hotelData.city || hotelData.hotelCity || "").trim();
    const location = hotelData.location || {
      type: "Point",
      coordinates: [72.8777, 19.0760],
    };

    let addressObj;
    if (typeof hotelData.address === "object" && hotelData.address !== null) {
      addressObj = {
        buildingName: hotelData.address.buildingName || hotelData.buildingName || "",
        doorNumber: hotelData.address.doorNumber || hotelData.doorNumber || "",
        streetAddress: hotelData.address.streetAddress || hotelData.address.address || hotelData.hotelAddress || "",
        areaName: hotelData.address.areaName || hotelData.areaName || "",
        city: hotelData.address.city || city || "Default City",
        district: hotelData.address.district || hotelData.district || "",
        state: hotelData.address.state || hotelData.state || "",
        postalCode: hotelData.address.postalCode || hotelData.postalCode || "",
        country: hotelData.address.country || hotelData.country || "India",
        countryCode: hotelData.address.countryCode || hotelData.countryCode || "IN",
        landmark: hotelData.address.landmark || hotelData.landmark || "",
        directions: hotelData.address.directions || hotelData.directions || "",
        formattedAddress: hotelData.address.formattedAddress || hotelData.formattedAddress || "",
        location: hotelData.address.location || location,
        placeId: hotelData.address.placeId || "",
        timeZone: hotelData.address.timeZone || "",
      };
    } else {
      const rawAddr = (hotelData.address || hotelData.hotelAddress || "").trim();
      addressObj = {
        buildingName: hotelData.buildingName || "",
        doorNumber: hotelData.doorNumber || "",
        streetAddress: rawAddr,
        areaName: hotelData.areaName || "",
        city: city || "Default City",
        district: hotelData.district || "",
        state: hotelData.state || "",
        postalCode: hotelData.postalCode || "",
        country: hotelData.country || "India",
        countryCode: "IN",
        landmark: hotelData.landmark || "",
        directions: hotelData.directions || "",
        formattedAddress: rawAddr || city,
        location: location,
      };
    }

    // Ensure formattedAddress is ready
    if (!addressObj.formattedAddress) {
      const parts = [
        addressObj.doorNumber,
        addressObj.buildingName,
        addressObj.streetAddress,
        addressObj.areaName,
        addressObj.landmark,
        addressObj.city,
        addressObj.district,
        addressObj.state,
        addressObj.postalCode,
        addressObj.country,
      ].filter(Boolean);
      addressObj.formattedAddress = parts.join(", ");
    }

    const cleanedPayload = {
      ...hotelData,
      address: addressObj,
      city: addressObj.city || city,
      location: addressObj.location || location,
    };

    //CHECK EXISTING HOTEL
    let hotel = await Hotel.findOne({ vendorId: vendor._id });

    if (hotel) {
      // update existing
      Object.assign(hotel, cleanedPayload);
      hotel.verificationStatus = "pending";
      await hotel.save();
    } else {
      hotel = await Hotel.create({
        ...cleanedPayload,
        vendorId: vendor._id,
        verificationStatus: "pending",
        isActive: false,
      });
    }

    //STEP UPDATE
    vendor.currentStep = 4;
    vendor.registrationStep = Math.max(vendor.registrationStep, 4);

    // Set activePropertyId to this hotel
    vendor.activePropertyId = hotel._id;

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


// get all hotels with filters, add rank
export const getAllHotels = async (query: any = {}, userId: any = null) => {
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
    }: any = query;

    if (!city) throw new Error("City is required");

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const amenityArray = amenities
      ? Array.isArray(amenities)
        ? amenities
        : amenities.split(",")
      : null;

    let startDate: any = null;
    let endDate: any = null;
    let nights = 1;

    if (checkIn && checkOut) {
      startDate = new Date(checkIn);
      endDate = new Date(checkOut);

      startDate.setUTCHours(0, 0, 0, 0);
      endDate.setUTCHours(0, 0, 0, 0);

      nights = Math.max(
        1,
        Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
      );
    }

    const cityRegex = { $regex: city.trim(), $options: "i" };
    const locationMatch = {
      $or: [
        { "address.city": cityRegex },
        { "address.areaName": cityRegex },
        { "address.district": cityRegex },
        { "address.streetAddress": cityRegex },
        { "address.landmark": cityRegex },
        { "address.formattedAddress": cityRegex },
        { city: cityRegex },
      ],
    };

    if (startDate && endDate) {
      const basePipeline = [
        {
          $match: {
            isActive: true,
            verificationStatus: "verified",
            ...locationMatch,
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
              $and: amenityArray.map((amenity: any) => ({
                $or: [
                  { amenities: amenity },
                  { "roomTypes.amenities": amenity },
                ],
              })),
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

        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            city: { $first: { $ifNull: ["$address.city", "$city"] } },
            address: { $first: "$address" },
            location: { $first: "$location" },
            coordinates: { $first: "$coordinates" },
            rating: { $first: "$rating" },
            numReviews: { $first: "$numReviews" },
            isFeatured: { $first: "$isFeatured" },
            description: { $first: "$description" },
            amenities: { $first: "$amenities" },
            images: { $first: "$images" },

            rank: { $first: "$rank" },

            startingPrice: { $min: "$effectivePrice" },
            availableRooms: { $min: "$minAvailableRooms" },
          },
        },

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
      ];

      const allMatched = await Hotel.aggregate(basePipeline as any[]);
      const total = allMatched.length;

      const paginatedPipeline = [
        ...basePipeline,
        { $skip: skip },
        { $limit: limitNum },
      ];

      const hotels = await Hotel.aggregate(paginatedPipeline as any[]);
      const updatedHotels = await attachFavoriteFlag(hotels, userId);

      return { hotels: updatedHotels, total };
    }

    const basePipeline = [
      {
        $match: {
          isActive: true,
          verificationStatus: "verified",
          ...locationMatch,
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
              },}
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
          ...(minSize || maxSize
            ? {
                "roomTypes.roomSizeSqm": {
                  ...(minSize && { $gte: Number(minSize) }),
                  ...(maxSize && { $lte: Number(maxSize) }),
                },
              }
            : {}),
          ...(minPrice || maxPrice
            ? {
                $or: [
                  {
                    "roomTypes.discountPrice": {
                      $gt: 0,
                      ...(minPrice && { $gte: Number(minPrice) }),
                      ...(maxPrice && { $lte: Number(maxPrice) }),
                    },
                  },
                  {
                    "roomTypes.discountPrice": 0,
                    "roomTypes.basePrice": {
                      ...(minPrice && { $gte: Number(minPrice) }),
                      ...(maxPrice && { $lte: Number(maxPrice) }),
                    },
                  },
                ],
              }
            : {}),
          ...(amenityArray && {
            $and: amenityArray.map((amenity: any) => ({
              $or: [
                { amenities: amenity },
                { "roomTypes.amenities": amenity },
              ],
            })),
          }),
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          city: { $first: { $ifNull: ["$address.city", "$city"] } },
          address: { $first: "$address" },
          location: { $first: "$location" },
          coordinates: { $first: "$coordinates" },
          rating: { $first: "$rating" },
          numReviews: { $first: "$numReviews" },
          isFeatured: { $first: "$isFeatured" },
          description: { $first: "$description" },
          amenities: { $first: "$amenities" },
          images: { $first: "$images" },
          rank: { $first: "$rank" },
          startingPrice: {
            $min: {
              $cond: [
                { $gt: ["$roomTypes.discountPrice", 0] },
                "$roomTypes.discountPrice",
                "$roomTypes.basePrice",
              ],
            },
          },
        },
      },
      {
        $addFields: {
          rank: { $ifNull: ["$rank", "C"] },
          thumbnail: { $arrayElemAt: ["$images.url", 0] },
          hotelImages: "$images",
          availableRooms: null,
          totalNights: 1,
          totalPrice: null,
        },
      },
      { $project: { images: 0 } },
      {
        $sort: {
          rank: 1,
          isFeatured: -1,
          rating: -1,
        },
      },
    ];

    const allMatched = await Hotel.aggregate(basePipeline as any[]);
    const total = allMatched.length;

    const paginatedPipeline = [
      ...basePipeline,
      { $skip: skip },
      { $limit: limitNum },
    ];

    const hotels = await Hotel.aggregate(paginatedPipeline as any[]);
    const updatedHotels = await attachFavoriteFlag(hotels, userId);

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

// get home hotels
export const getHomeHotels = async (query: any = {}, userId: any = null) => {
  try {
    const { city } = query;

    // STEP 1: Find all hotel IDs that have at least one active room (similar to tours)
    const hotelsWithActiveRooms = await RoomType.distinct("hotelId", {
      isActive: true,
    });

    if (!hotelsWithActiveRooms || hotelsWithActiveRooms.length === 0) {
      return [];
    }

    const filter: any = {
      _id: { $in: hotelsWithActiveRooms },
      isActive: true,
      verificationStatus: "verified",
    };

    if (city && city.trim()) {
      const cityRegex = { $regex: city.trim(), $options: "i" };
      filter.$or = [
        { "address.city": cityRegex },
        { "address.areaName": cityRegex },
        { "address.district": cityRegex },
        { "address.streetAddress": cityRegex },
        { "address.landmark": cityRegex },
        { "address.formattedAddress": cityRegex },
        { city: cityRegex },
      ];
    }

    const hotels = await Hotel.find(filter)
      .select("name city address images rating numReviews isFeatured rank amenities")
      .sort({ isFeatured: -1, rank: 1, rating: -1, createdAt: -1 })
      .lean();

    // Fetch cheapest room price per hotel in a single aggregation
    const hotelIds = hotels.map((h: any) => h._id);
    const priceAgg = await RoomType.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$hotelId",
          minPrice: {
            $min: {
              $cond: [
                { $gt: ["$discountPrice", 0] },
                "$discountPrice",
                "$basePrice",
              ],
            },
          },
        },
      },
    ]);

    const priceMap: Record<string, number> = {};
    priceAgg.forEach((p: any) => {
      priceMap[p._id.toString()] = p.minPrice;
    });

    // Real review stats aggregated directly from the Review collection
    const reviewAgg = await Review.aggregate([
      {
        $match: {
          companyType: "hotel",
          companyId: { $in: hotelIds },
        },
      },
      {
        $group: {
          _id: "$companyId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const reviewMap: Record<string, { rating: number; numReviews: number }> = {};
    reviewAgg.forEach((r: any) => {
      reviewMap[r._id.toString()] = {
        rating: Number(r.averageRating.toFixed(1)),
        numReviews: r.totalReviews,
      };
    });

    const formatAmenityName = (amenity: string): string => {
      const map: Record<string, string> = {
        free_wifi: "Free WiFi",
        wifi: "Free WiFi",
        free_parking: "Free Parking",
        parking: "Parking",
        breakfast: "Breakfast",
        mountain_view: "Mountain View",
        room_service: "Room Service",
        bonfire: "Bonfire",
        garden: "Garden",
        restaurant: "Restaurant",
        terrace: "Terrace",
        balcony: "Balcony",
      };
      return (
        map[amenity.toLowerCase()] ||
        amenity
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      );
    };

    const formattedHotels = hotels.map((hotel: any) => {
      const realRev = reviewMap[hotel._id.toString()];

      const rating =
        realRev && realRev.numReviews > 0
          ? realRev.rating
          : typeof hotel.rating === "number" && hotel.rating > 0
          ? Number(hotel.rating.toFixed(1))
          : 0;

      const numReviews =
        realRev && realRev.numReviews > 0
          ? realRev.numReviews
          : typeof hotel.numReviews === "number"
          ? hotel.numReviews
          : 0;

      const amenities =
        Array.isArray(hotel.amenities) && hotel.amenities.length > 0
          ? hotel.amenities.slice(0, 3).map(formatAmenityName)
          : [];

      const rawImg = hotel.images?.[0]?.url;
      const image = rawImg || "/hotels/room1.png";

      const startingPrice = priceMap[hotel._id.toString()] || 0;

      return {
        _id: hotel._id,
        name: hotel.name,
        city: hotel.address?.city || hotel.city,
        address: hotel.address,
        rating,
        numReviews,
        amenities,
        image,
        images:
          hotel.images?.map((i: any) => i.url).filter(Boolean) || [image],
        rank: hotel?.rank || "C",
        isFeatured: hotel.isFeatured || false,
        startingPrice,
      };
    });

    const updatedHotels = await attachFavoriteFlag(formattedHotels, userId);
    return updatedHotels;
  } catch (error) {
    throw error;
  }
};

// Get a single hotel detail by id
export const getHotelDetails = async (hotelId: any, userId: any = null) => {
  const hotel = await Hotel.findOne({
    _id: hotelId,
    isActive: true,
    verificationStatus: "verified",
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
    roomTypes: roomTypes.map((room: any) => ({
      ...room,
      displayPrice:
        (room.discountPrice && room.discountPrice > 0) ? room.discountPrice : room.basePrice,
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

export const getHotelAvailability = async (
  hotelId: any,
  checkIn: any,
  checkOut: any,
  adults: any,
  children: any,
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

  const nights = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

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
        ((room.discountPrice && room.discountPrice > 0) ? room.discountPrice : room.basePrice);

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

export const updateHotel = async (hotelId: any, vendorId: any, updateData: any) => {
  try {
    const existingHotel = await Hotel.findOne({
      _id: hotelId,
      vendorId,
    });

    if (!existingHotel) throw new Error("Hotel not found or unauthorized");

    if (updateData.images && Array.isArray(updateData.images)) {
      if (existingHotel.images && existingHotel.images.length > 0) {
        const remainingPublicIds = new Set(
          updateData.images.map((img: any) => img?.public_id).filter(Boolean)
        );
        for (const img of existingHotel.images) {
          if (img?.public_id && !remainingPublicIds.has(img.public_id)) {
            try {
              await cloudinary.uploader.destroy(img.public_id, {
                resource_type: (img as any).resource_type || "image",
              });
            } catch (destroyErr) {
              logger.warn("Could not delete removed hotel image", destroyErr);
            }
          }
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

// Find hotels near a specific location (Geospatial Search using MongoDB 2dsphere S2/R-Tree index)
export const findNearbyHotels = async (
  lng: number,
  lat: number,
  radiusMeters: number = 2000,
  limit: number = 20,
  userId: any = null,
) => {
  try {
    const validRadius = Math.min(Math.max(Number(radiusMeters) || 2000, 50), 50000);
    const validLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

    // MongoDB Geospatial Aggregation using 2dsphere index and $geoNear
    let hotels: any[] = [];
    try {
      hotels = await Hotel.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [lng, lat],
            },
            key: "location",
            distanceField: "distance",
            maxDistance: validRadius,
            spherical: true,
            query: { isActive: true },
          },
        },
        { $limit: validLimit },
      ]);
    } catch (geoNearErr) {
      // Fallback to native $near find query if $geoNear aggregation encounters pipeline restriction
      hotels = await Hotel.find({
        isActive: true,
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [lng, lat] },
            $maxDistance: validRadius,
          },
        },
      })
        .limit(validLimit)
        .lean();
    }

    if (!hotels || hotels.length === 0) {
      return [];
    }

    const hotelIds = hotels.map((h: any) => h._id);

    // 1. Fetch Room Prices
    const priceAgg = await RoomType.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$hotelId",
          minPrice: {
            $min: {
              $cond: [
                { $gt: ["$discountPrice", 0] },
                "$discountPrice",
                "$basePrice",
              ],
            },
          },
        },
      },
    ]);

    const priceMap: Record<string, number> = {};
    priceAgg.forEach((p: any) => {
      priceMap[p._id.toString()] = p.minPrice;
    });

    // 2. Fetch Review Stats
    const reviewAgg = await Review.aggregate([
      {
        $match: {
          companyType: "hotel",
          companyId: { $in: hotelIds },
        },
      },
      {
        $group: {
          _id: "$companyId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const reviewMap: Record<string, { rating: number; numReviews: number }> = {};
    reviewAgg.forEach((r: any) => {
      reviewMap[r._id.toString()] = {
        rating: Number(r.averageRating.toFixed(1)),
        numReviews: r.totalReviews,
      };
    });

    // 3. Format and enrich hotels with distances
    const formattedHotels = hotels.map((hotel: any) => {
      const realRev = reviewMap[hotel._id.toString()];
      const rating =
        realRev && realRev.numReviews > 0
          ? realRev.rating
          : typeof hotel.rating === "number" && hotel.rating > 0
          ? Number(hotel.rating.toFixed(1))
          : 0;

      const numReviews =
        realRev && realRev.numReviews > 0
          ? realRev.numReviews
          : typeof hotel.numReviews === "number"
          ? hotel.numReviews
          : 0;

      const rawImg = hotel.images?.[0]?.url;
      const image = rawImg || "/hotels/room1.png";
      const startingPrice = priceMap[hotel._id.toString()] || 0;

      // Distance calculation in meters (from $geoNear or fallback haversine)
      let distanceMeters: number | null = null;
      if (typeof hotel.distance === "number") {
        distanceMeters = Math.round(hotel.distance);
      } else if (hotel.location?.coordinates?.length >= 2) {
        // Haversine fallback if $near was used instead of $geoNear
        const hLng = hotel.location.coordinates[0];
        const hLat = hotel.location.coordinates[1];
        const R = 6371e3; // metres
        const φ1 = (lat * Math.PI) / 180;
        const φ2 = (hLat * Math.PI) / 180;
        const Δφ = ((hLat - lat) * Math.PI) / 180;
        const Δλ = ((hLng - lng) * Math.PI) / 180;
        const a =
          Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        distanceMeters = Math.round(R * c);
      }

      return {
        _id: hotel._id,
        name: hotel.name,
        city: hotel.address?.city || hotel.city,
        address: hotel.address || hotel.formattedAddress || "",
        location: hotel.location,
        coordinates: hotel.location?.coordinates || null,
        rating,
        numReviews,
        amenities: hotel.amenities || [],
        image,
        images: hotel.images?.map((i: any) => i.url).filter(Boolean) || [image],
        rank: hotel?.rank || "C",
        isFeatured: hotel.isFeatured || false,
        startingPrice,
        price: startingPrice,
        distance: distanceMeters,
      };
    });

    const updatedHotels = await attachFavoriteFlag(formattedHotels, userId);
    return updatedHotels;
  } catch (error) {
    logger.error("Service Error: findNearbyHotels", error);
    throw error;
  }
};

export const getSuggestions = async (query: any) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const cleanQuery = query.trim();
  const reg = { $regex: cleanQuery, $options: "i" };

  const results = await Hotel.find(
    {
      isActive: true,
      verificationStatus: "verified",
      $or: [
        { name: reg },
        { "address.city": reg },
        { "address.areaName": reg },
        { "address.district": reg },
        { "address.streetAddress": reg },
        { "address.landmark": reg },
        { "address.formattedAddress": reg },
        { "address.state": reg },
        { city: reg },
      ],
    },
    {
      name: 1,
      city: 1,
      address: 1,
    },
  )
    .limit(30)
    .lean();

  // Build unique location suggestions without counting hotels
  const locationMap = new Map();

  for (const hotel of results) {
    const city = hotel.address?.city || hotel.city || "";
    const area = hotel.address?.areaName || "";
    const district = hotel.address?.district || "";
    const state = hotel.address?.state || "";
    const landmark = hotel.address?.landmark || "";

    // Add city suggestion
    if (city) {
      const key = `city:${city.toLowerCase()}`;
      if (!locationMap.has(key)) {
        locationMap.set(key, {
          type: "city",
          value: city,
          label: [city, state].filter(Boolean).join(", "),
          state,
        });
      }
    }

    // Add area/town suggestion (only if it matched the query)
    if (area && reg.$regex && new RegExp(cleanQuery, "i").test(area)) {
      const key = `town:${area.toLowerCase()}`;
      if (!locationMap.has(key)) {
        locationMap.set(key, {
          type: "town",
          value: area,
          label: [area, city, state].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(", "),
          city,
          state,
        });
      }
    }

    // Add district suggestion (only if it matched the query)
    if (district && new RegExp(cleanQuery, "i").test(district)) {
      const key = `district:${district.toLowerCase()}`;
      if (!locationMap.has(key)) {
        locationMap.set(key, {
          type: "district",
          value: district,
          label: [district, state].filter(Boolean).join(", "),
          state,
        });
      }
    }

    // Add landmark suggestion (only if it matched the query)
    if (landmark && new RegExp(cleanQuery, "i").test(landmark)) {
      const key = `landmark:${landmark.toLowerCase()}`;
      if (!locationMap.has(key)) {
        locationMap.set(key, {
          type: "landmark",
          value: landmark,
          label: [landmark, city, state].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(", "),
          city,
          state,
        });
      }
    }
  }

  // Sort: exact prefix matches first, then alphabetically
  const locationSuggestions = [...locationMap.values()]
    .sort((a, b) => {
      const aStarts = a.value.toLowerCase().startsWith(cleanQuery.toLowerCase()) ? 0 : 1;
      const bStarts = b.value.toLowerCase().startsWith(cleanQuery.toLowerCase()) ? 0 : 1;
      if (aStarts !== bStarts) return aStarts - bStarts;
      return a.value.localeCompare(b.value);
    })
    .slice(0, 6);

  // Hotel name suggestions
  const hotelSuggestions = results
    .filter((h) => new RegExp(cleanQuery, "i").test(h.name))
    .slice(0, 3)
    .map((hotel) => ({
      type: "hotel",
      id: hotel._id,
      value: hotel.name,
      label: hotel.address?.city || hotel.city || "",
      city: hotel.address?.city || hotel.city,
    }));

  return [...locationSuggestions, ...hotelSuggestions];
};

export const searchHotels = async (query: any = {}, userId: any = null) => {
  const {
    destination,
    checkIn,
    checkOut,
    adults = 1,
    children = 0,
    page = 1,
    limit = 10,
  }: any = query;

  if (!destination) {
    throw new Error("Destination (city) is required");
  }

  const skip = (Number(page) - 1) * Number(limit);

  let startDate: any = null;
  let endDate: any = null;
  let nights = 1;

  if (checkIn && checkOut) {
    startDate = new Date(checkIn);
    endDate = new Date(checkOut);

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);

    nights = Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
    );
  }

  const pipeline = [
    //HOTEL FILTER
    {
      $match: {
        isActive: true,
        verificationStatus: "verified",
        $or: [
          { "address.city": { $regex: destination.trim(), $options: "i" } },
          { "address.areaName": { $regex: destination.trim(), $options: "i" } },
          { "address.district": { $regex: destination.trim(), $options: "i" } },
          { "address.streetAddress": { $regex: destination.trim(), $options: "i" } },
          { "address.landmark": { $regex: destination.trim(), $options: "i" } },
          { "address.formattedAddress": { $regex: destination.trim(), $options: "i" } },
          { city: { $regex: destination.trim(), $options: "i" } },
        ],
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
        city: { $first: { $ifNull: ["$address.city", "$city"] } },
        address: { $first: "$address" },
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
        hotelImages: "$images",
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

  const hotels = await Hotel.aggregate(pipeline as any[]);
  const updatedHotels = await attachFavoriteFlag(hotels, userId);

  return updatedHotels;
};

// Get ranked hotels for banner slideshows (paginated)
export const getRankedHotels = async (rank: any, page: any = 1, limit: any = 10) => {
  try {
    if (!rank || !["A", "B", "C"].includes(rank)) {
      return { items: [], total: 0, page: 1, limit: 10, hasMore: false };
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {
      rank,
      isActive: true,
      verificationStatus: "verified",
    };

    const total = await Hotel.countDocuments(filter);

    if (total === 0) {
      return { items: [], total: 0, page: pageNum, limit: limitNum, hasMore: false };
    }

    const hotels = await Hotel.find(filter)
      .select("name city address images advertisementImage rating numReviews isFeatured")
      .sort({ isFeatured: -1, rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const items = hotels.map((hotel: any) => ({
      _id: hotel._id,
      name: hotel.name,
      city: hotel.address?.city || hotel.city,
      rating: hotel.rating,
      numReviews: hotel.numReviews,
      image: hotel.advertisementImage?.url || hotel.images?.[0]?.url || null,
    }));

    return {
      items,
      total,
      page: pageNum,
      limit: limitNum,
      hasMore: skip + limitNum < total,
    };
  } catch (error) {
    logger.error("Service Error: getRankedHotels", error);
    throw error;
  }
};

export class HotelService {
  async createHotel(vendor: any, hotelData: any) {
    return createHotel(vendor, hotelData);
  }

  async getAllHotels(query: any = {}, userId: any = null) {
    return getAllHotels(query, userId);
  }

  async getHomeHotels(query: any = {}, userId: any = null) {
    return getHomeHotels(query, userId);
  }

  async getHotelDetails(hotelId: any, userId: any = null) {
    return getHotelDetails(hotelId, userId);
  }

  async getHotelAvailability(hotelId: any, checkIn: any, checkOut: any, adults: any, children: any) {
    return getHotelAvailability(hotelId, checkIn, checkOut, adults, children);
  }

  async updateHotel(hotelId: any, vendorId: any, updateData: any) {
    return updateHotel(hotelId, vendorId, updateData);
  }

  async findNearbyHotels(
    lng: any,
    lat: any,
    maxDistance: any = 2000,
    limit: any = 20,
    userId: any = null,
  ) {
    return findNearbyHotels(lng, lat, maxDistance, limit, userId);
  }

  async getSuggestions(query: any) {
    return getSuggestions(query);
  }

  async searchHotels(query: any = {}, userId: any = null) {
    return searchHotels(query, userId);
  }

  async getRankedHotels(rank: any, page: any = 1, limit: any = 10) {
    return getRankedHotels(rank, page, limit);
  }
}

export const hotelService = new HotelService();

export default hotelService;


