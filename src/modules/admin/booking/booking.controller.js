const bookingService = require("./booking.service");
const logger = require("../../../shared/utils/logger");

// Get all bookings
exports.getAllBookings = async (req, res, next) => {
  try {
    const result = await bookingService.getAllBookings(req.query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getAllBookings", error);
    next(error);
  }
};

// Get booking detail
exports.getBookingDetail = async (req, res, next) => {
  try {
    const result = await bookingService.getBookingDetail(req.params.bookingId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getBookingDetail(Admin)", error);
    next(error);
  }
};

// Get booking stats
exports.getBookingStats = async (req, res, next) => {
  try {
    const result = await bookingService.getBookingStats();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getBookingStats", error);
    next(error);
  }
};
