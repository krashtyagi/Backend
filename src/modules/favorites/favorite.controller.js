const favoriteService = require("./favorite.service");
const logger = require("../../shared/utils/logger");

//Toggle Favorite
// exports.toggleFavorite = async (req, res, next) => {
//   try {
//     const { itemId } = req.params;
//     const userId = req.user.id;

//     const result = await favoriteService.toggleFavorite(
//       userId,
//       itemId,
//       "hotel",
//     );

//     res.status(200).json({
//       success: true,
//       ...result,
//     });
//   } catch (error) {
//     logger.error("Controller Error: toggleFavorite", error);
//     next(error);
//   }
// };

exports.toggleFavorite = async (req, res, next) => {
  try {
    const { itemId, serviceType } = req.params;

    const userId = req.user.id;

    const result = await favoriteService.toggleFavorite(
      userId,
      itemId,
      serviceType,
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Controller Error: toggleFavorite", error);

    next(error);
  }
};

//Get current user's favorites
exports.getMyFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const favorites = await favoriteService.getUserFavorites(userId);

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites,
    });
  } catch (error) {
    logger.error("Controller Error: getMyFavorites", error);
    next(error);
  }
};

//Get favorites summary images
exports.getFavoritesSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const data = await favoriteService.getFavoritesSummary(userId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

//Get my trip favorites 
exports.getMyTripFavorites = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const hotels = await favoriteService.getMyTripFavorites(
      userId,
      page,
      limit,
    );

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    });
  } catch (error) {
    next(error);
  }
};

