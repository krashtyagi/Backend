const bookingService = require("./booking.service");
const logger = require("../../../shared/utils/logger");
const Vendor = require("../../vendors/vendor.model");

exports.getVendorBookings = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    const result = await bookingService.getVendorBookings(req.query, vendor);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorBookings", error);
    next(error);
  }
};

exports.getVendorBookingById = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    const bookingId = req.params.id;

    const booking = await bookingService.getVendorBookingById(
      bookingId,
      vendor,
    );

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorBookingDetail", error);
    next(error);
  }
};
