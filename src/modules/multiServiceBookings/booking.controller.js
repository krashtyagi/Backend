const bookingService = require("./booking.service");
const logger = require("../../shared/utils/logger");

exports.createBooking = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await bookingService.createBooking(req.body, userId);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: createBooking", error);
    next(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const booking = await bookingService.verifyPayment(req.body);

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    logger.error("Controller Error: verifyPayment", error);
    next(error);
  }
};
