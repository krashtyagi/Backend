const Vendor = require("../vendors/vendor.model");
const bookingService = require("../bookings/booking.service");
const roomTypeService = require("../rooms/roomType.service");

const vendorService = require("./vendor.service");
const logger = require("../../shared/utils/logger");

//get me help for prefilling data
exports.getVendorMe = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const data = await vendorService.getVendorMe(userId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorMe", error);
    next(error);
  }
};

//vendor profile create step-2
exports.createVendorProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const vendor = await vendorService.createVendorProfile(userId, req.body);

    res.status(200).json({
      success: true,
      message: "Step 2 saved successfully",
      data: {
        currentStep: vendor.currentStep,
        registrationStep: vendor.registrationStep,
        status: vendor.status,
      },
    });
  } catch (error) {
    logger.error("Controller Error: createVendorProfile", error);
    next(error);
  }
};

//final step of registration step-5
exports.submitVendor = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const updatedVendor = await vendorService.submitVendor(vendor);

    res.status(200).json({
      success: true,
      message: "Submitted successfully. Waiting for admin approval.",
      data: {
        status: updatedVendor.status,
        currentStep: updatedVendor.currentStep,
      },
    });
  } catch (error) {
    logger.error("Controller Error: submitVendor", error);
    next(error);
  }
};

//get booking list in dashboard-vendor
exports.getVendorBookings = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor || vendor.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Vendor not approved or not found",
      });
    }

    const result = await bookingService.getVendorBookings(
      vendor._id,
      req.query,
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Vendor Booking List Error:", error);
    next(error);
  }
};

//get booking detail in dashboard-vendor
exports.getVendorBookingDetail = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor || vendor.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Vendor not approved or not found",
      });
    }

    const booking = await roomTypeService.getVendorBookingDetail(
      req.params.id,
      vendor._id,
    );

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    logger.error("Vendor Booking Detail Error:", error);
    next(error);
  }
};

//get in dashboardroom type controller
exports.getVendorRoomTypes = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor || vendor.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Vendor not approved or not found",
      });
    }

    const result = await roomTypeService.getVendorRoomTypes(
      vendor._id,
      req.query,
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Vendor RoomType List Error:", error);
    next(error);
  }
};

//get room type detail in dashboard-vendor
exports.getVendorRoomTypeDetail = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor || vendor.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Vendor not approved or not found",
      });
    }

    const result = await roomTypeService.getVendorRoomTypeDetail(
      req.params.id,
      vendor._id,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Vendor RoomType Detail Error:", error);
    next(error);
  }
};

//invoice
exports.getVendorInvoices = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor || vendor.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Vendor not approved or not found",
      });
    }

    const result = await bookingService.getVendorInvoices(
      vendor._id,
      req.query,
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Vendor Invoice List Error:", error);
    next(error);
  }
};

//invocie download vendor
exports.downloadInvoicePdf = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor || vendor.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Vendor not authorized",
      });
    }

    await bookingService.generateInvoicePdf(
      req.params.bookingId,
      vendor._id,
      res,
    );
  } catch (error) {
    logger.error("Download Invoice Error:", error);
    next(error);
  }
};

//vendor dashboard
exports.getVendorDashboard = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id })
      .select("_id status")
      .lean();
    if (!vendor || vendor.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Vendor not authorized",
      });
    }

    const reservationDays = parseInt(req.query.reservationDays) || 7;
    const revenueMonths = parseInt(req.query.revenueMonths) || 6;

    const data = await bookingService.getVendorDashboard(
      vendor._id,
      reservationDays,
      revenueMonths,
    );
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Dashboard Error:", error);
    next(error);
  }
};

//user check-in
exports.checkInBooking = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor || vendor.status !== "approved") {
      return res.status(403).json({ message: "Unauthorized vendor" });
    }

    const result = await bookingService.checkInBooking(
      req.params.id,
      vendor._id,
    );

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    logger.error("Check-in Error:", err);
    next(err);
  }
};

//user staying
exports.markBookingStaying = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor || vendor.status !== "approved") {
      return res.status(403).json({ message: "Unauthorized vendor" });
    }

    const result = await bookingService.markBookingStaying(
      req.params.id,
      vendor._id,
    );

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    logger.error("Staying Error:", err);
    next(err);
  }
};

//user check-out
exports.checkOutBooking = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor || vendor.status !== "approved") {
      return res.status(403).json({ message: "Unauthorized vendor" });
    }

    const result = await bookingService.checkOutBooking(
      req.params.id,
      vendor._id,
    );

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    logger.error("Check-out Error:", err);
    next(err);
  }
};
