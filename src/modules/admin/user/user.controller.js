const userService = require("./user.service");
const logger = require("../../../shared/utils/logger");

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers(req.query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getAllUsers", error);
    next(error);
  }
};

//Get user booking history list
exports.getUserBookings = async (req, res, next) => {
  try {
    const result = await userService.getUserBookings(
      req.params.userId,
      req.query,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getUserBookings", error);
    next(error);
  }
};

// Get booking detail
exports.getBookingDetail = async (req, res, next) => {
  try {
    const result = await userService.getBookingDetail(
      req.params.userId,
      req.params.bookingId,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getBookingDetail", error);
    next(error);
  }
};

// Block / Unblock user
exports.updateUserStatus = async (req, res, next) => {
  try {
    const result = await userService.updateUserStatus(
      req.params.userId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.user,
    });
  } catch (error) {
    logger.error("Controller Error: updateUserStatus", error);
    next(error);
  }
};
