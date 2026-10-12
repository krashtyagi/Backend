import Favorite from "./favorite.model.js";
import Hotel from "../hotels/hotel.model.js";
import CabCompany from "../cab/company/cab.model.js";
import BikeCompany from "../bike/company/bike.model.js";
import TourCompany from "../tour/company/tour.model.js";
import Adventure from "../adventure/category/adventure.model.js";

const SERVICE_MODELS: Record<string, any> = {
  hotel: Hotel,
  cab: CabCompany,
  bike: BikeCompany,
  tour: TourCompany,
  adventure: Adventure,
};

const getThumbnail = (item: any, itemType: string) => {
  if (!item?.images?.length) return null;

  // HOTEL IMAGE FORMAT
  if (itemType === "hotel") {
    return item.images?.[0]?.url || null;
  }

  return item.images?.[0] || null;
};

export const toggleFavorite = async (userId: any, itemId: any, itemType: string = "hotel") => {
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

export const getUserFavorites = async (userId: any, itemType?: string) => {
  const filter: any = {
    user: userId,
  };

  // OPTIONAL FILTER
  if (itemType) {
    filter.itemType = itemType;
  }

  return await Favorite.find(filter).select("itemId itemType").lean();
};

export const getFavoritesSummary = async (userId: any) => {
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

  const coverImages: string[] = [];

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

export const getMyTripFavorites = async (userId: any, page: any = 1, limit: any = 10) => {
  const skip = (Number(page) - 1) * Number(limit);

  const favorites = await Favorite.find({
    user: userId,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const results: any[] = [];

  for (const fav of favorites) {
    const Model = SERVICE_MODELS[fav.itemType];

    if (!Model) continue;

    const item: any = await Model.findOne({
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

export class FavoriteService {
  async toggleFavorite(userId: any, itemId: any, itemType: string = "hotel") {
    return toggleFavorite(userId, itemId, itemType);
  }

  async getUserFavorites(userId: any, itemType?: string) {
    return getUserFavorites(userId, itemType);
  }

  async getFavoritesSummary(userId: any) {
    return getFavoritesSummary(userId);
  }

  async getMyTripFavorites(userId: any, page: any = 1, limit: any = 10) {
    return getMyTripFavorites(userId, page, limit);
  }
}

export const favoriteService = new FavoriteService();

export default favoriteService;

