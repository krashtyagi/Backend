const hotelService = require("./hotel.service");
const logger = require("../../shared/utils/logger");
const Vendor = require("../vendors/vendor.model");


exports.createHotel = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const hotel = await hotelService.createHotel(vendor, req.body);

    res.status(200).json({
      success: true,
      message: "Step 4 completed successfully",
      data: {
        currentStep: vendor.currentStep,
        registrationStep: vendor.registrationStep,
        status: vendor.status,
      },
    });
  } catch (error) {
    logger.error("Controller Error: createHotel", error);
    next(error);
  }
};

// Get all hotels with filtering and pagination support
exports.getHotels = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;

    const { hotels, total } = await hotelService.getAllHotels(
      req.query,
      userId,
    );

    res.status(200).json({
      success: true,
      count: hotels.length,
      total,
      data: hotels,
    });
  } catch (error) {
    logger.error("Controller Error: getHotels", error);
    next(error);
  }
};

// Get a single hotel by ID for the details page
exports.getHotelDetails = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;
    const hotel = await hotelService.getHotelDetails(req.params.id, userId);

    res.status(200).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
};

//checking availability mode
exports.getHotelAvailability = async (req, res, next) => {
  try {
    const { checkIn, checkOut, adults, children } = req.query;

    const data = await hotelService.getHotelAvailability(
      req.params.id,
      checkIn,
      checkOut,
      Number(adults),
      Number(children),
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Update hotel details (Only for the owner vendor)
exports.updateHotel = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor) throw new Error("Vendor profile not found");

    const hotel = await hotelService.updateHotel(
      req.params.id,
      vendor._id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Hotel updated successfully",
      data: hotel,
    });
  } catch (error) {
    logger.error("Controller Error: updateHotel", error);
    next(error);
  }
};

// Search nearby hotels based on coordinates (Geospatial API)
exports.getNearbyHotels = async (req, res, next) => {
  try {
    const { lng, lat, distance } = req.query;

    if (!lng || !lat) {
      throw new Error("Please provide longitude and latitude");
    }

    const hotels = await hotelService.findNearbyHotels(
      Number(lng),
      Number(lat),
      Number(distance) || 5000, // Default 5km
      userId,
    );

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    });
  } catch (error) {
    logger.error("Controller Error: getNearbyHotels", error);
    next(error);
  }
};

//get home hotels
exports.getHomeHotels = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;

    const hotels = await hotelService.getHomeHotels(req.query, userId);

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    });
  } catch (error) {
    logger.error("Controller Error: getHomeHotels", error);
    next(error);
  }
};

//get auto-suggestions for search
exports.getSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;

    const suggestions = await hotelService.getSuggestions(q);

    res.status(200).json({
      success: true,
      count: suggestions.length,
      data: suggestions,
    });
  } catch (error) {
    logger.error("Controller Error: getSuggestions", error);
    next(error);
  }
};

// Search hotels in destination
exports.searchHotels = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;
    const hotels = await hotelService.searchHotels(req.query, userId);

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    });
  } catch (err) {
    next(err);
  }
};
