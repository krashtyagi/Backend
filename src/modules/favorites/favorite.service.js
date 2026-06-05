// const Favorite = require("./favorite.model");
// const Hotel = require("../hotels/hotel.model");

// exports.toggleFavorite = async (userId, itemId, itemType = "hotel") => {
//   const existing = await Favorite.findOne({
//     user: userId,
//     itemId,
//     itemType,
//   });

//   if (existing) {
//     await existing.deleteOne();
//     return { isFavorite: false };
//   }

//   await Favorite.create({
//     user: userId,
//     itemId,
//     itemType,
//   });

//   return { isFavorite: true };
// };

// exports.getUserFavorites = async (userId, itemType = "hotel") => {
//   return await Favorite.find({ user: userId, itemType })
//     .select("itemId")
//     .lean();
// };

// exports.getFavoritesSummary = async (userId) => {
//   const favorites = await Favorite.find({
//     user: userId,
//     itemType: "hotel",
//   }).select("itemId");

//   const totalSaved = favorites.length;

//   if (totalSaved === 0) {
//     return {
//       name: "My next trip",
//       totalSaved: 0,
//       coverImages: [],
//     };
//   }

//   const hotelIds = favorites.map((fav) => fav.itemId);
//   const hotels = await Hotel.find({
//     _id: { $in: hotelIds },
//   })
//     .select("images")
//     .limit(4)
//     .lean();

//   const coverImages = hotels
//     .map((hotel) => hotel.images?.[0]?.url)
//     .filter(Boolean);

//   return {
//     name: "My next trip",
//     totalSaved,
//     coverImages,
//   };
// };

// exports.getMyTripFavorites = async (userId, page = 1, limit = 10) => {
//   const skip = (page - 1) * limit;

//   const favorites = await Favorite.find({
//     user: userId,
//     itemType: "hotel",
//   })
//     .skip(skip)
//     .limit(Number(limit))
//     .lean();

//   const hotelIds = favorites.map((fav) => fav.itemId);

//   const hotels = await Hotel.find({
//     _id: { $in: hotelIds },
//     isActive: true,
//   })
//     .select("name city rating numReviews images")
//     .lean();

//   return hotels.map((hotel) => ({
//     ...hotel,
//     thumbnail: hotel.images?.[0]?.url || null,
//     isFavorite: true,
//   }));
// };

const Favorite = require("./favorite.model");

const Hotel = require("../hotels/hotel.model");
const CabCompany = require("../cab/company/cab.model");
const BikeCompany = require("../bike/company/bike.model");
const TourCompany = require("../tour/company/tour.model");
const Adventure = require("../adventure/category/adventure.model");

const SERVICE_MODELS = {
  hotel: Hotel,
  cab: CabCompany,
  bike: BikeCompany,
  tour: TourCompany,
  adventure: Adventure,
};

const getThumbnail = (item, itemType) => {
  if (!item?.images?.length) return null;

  // HOTEL IMAGE FORMAT
  if (itemType === "hotel") {
    return item.images?.[0]?.url || null;
  }

  return item.images?.[0] || null;
};

exports.toggleFavorite = async (userId, itemId, itemType) => {
  const existing = await Favorite.findOne({
    user: userId,
    itemId,
    itemType,
  });

  if (existing) {
    await existing.deleteOne();

    return {
      isFavorite: false,
    };
  }

  await Favorite.create({
    user: userId,
    itemId,
    itemType,
  });

  return {
    isFavorite: true,
  };
};

exports.getUserFavorites = async (userId, itemType) => {
  const filter = {
    user: userId,
  };

  // OPTIONAL FILTER
  if (itemType) {
    filter.itemType = itemType;
  }

  return await Favorite.find(filter).select("itemId itemType").lean();
};

exports.getFavoritesSummary = async (userId) => {
  const favorites = await Favorite.find({
    user: userId,
  })
    .limit(20)
    .lean();

  const totalSaved = favorites.length;

  if (totalSaved === 0) {
    return {
      name: "My Favorites",
      totalSaved: 0,
      coverImages: [],
    };
  }

  const coverImages = [];

  for (const fav of favorites) {
    const Model = SERVICE_MODELS[fav.itemType];

    if (!Model) continue;

    const item = await Model.findById(fav.itemId).select("images").lean();

    if (!item) continue;

    const thumbnail = getThumbnail(item, fav.itemType);

    if (thumbnail) {
      coverImages.push(thumbnail);
    }

    if (coverImages.length >= 4) {
      break;
    }
  }

  return {
    name: "My Favorites",
    totalSaved,
    coverImages,
  };
};

exports.getMyTripFavorites = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const favorites = await Favorite.find({
    user: userId,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const results = [];

  for (const fav of favorites) {
    const Model = SERVICE_MODELS[fav.itemType];

    if (!Model) continue;

    const item = await Model.findOne({
      _id: fav.itemId,
      isActive: true,
    }).lean();

    if (!item) continue;

    // HOTEL
    if (fav.itemType === "hotel") {
      results.push({
        _id: item._id,

        itemType: "hotel",

        name: item.name,
        city: item.city,

        rating: item.rating,
        numReviews: item.numReviews,

        thumbnail: getThumbnail(item, "hotel"),

        isFavorite: true,
      });

      continue;
    }

    // OTHER SERVICES
    results.push({
      _id: item._id,

      itemType: fav.itemType,

      name: item.name,

      location: item.location || {},

      rating: item.rating || {},

      thumbnail: getThumbnail(item, fav.itemType),

      isFavorite: true,
    });
  }

  return results;
};
