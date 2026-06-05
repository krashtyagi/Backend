const dashboardService = require("./dashboard.service");
const logger = require("../../../shared/utils/logger");

//dashboard card and charts with filter days
exports.getDashboard = async (req, res, next) => {
  try {
    let bookingRange = Number(req.query.bookingRange);
    let revenueRange = Number(req.query.revenueRange);

    const allowedBooking = [7, 15, 30];
    const allowedRevenue = [3, 6, 12];

    if (!allowedBooking.includes(bookingRange)) {
      bookingRange = 7;
    }

    if (!allowedRevenue.includes(revenueRange)) {
      revenueRange = 6;
    }

    const data = await dashboardService.getDashboard({
      bookingRange,
      revenueRange,
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getDashboard", error);

    next(error);
  }
};

//Get recent bookings
exports.getRecentBookings = async (req, res, next) => {
  try {
    const result = await dashboardService.getRecentBookings();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getRecentBookings", error);
    next(error);
  }
};
