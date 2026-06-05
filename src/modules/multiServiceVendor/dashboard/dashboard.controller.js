// const dashboardService = require("./dashboard.service");
// const logger = require("../../../shared/utils/logger");

// exports.getDashboardStats = async (req, res, next) => {
//   try {
//     const vendorId = req.user._id;

//     const stats = await dashboardService.getDashboardStats(
//       req.query,
//       vendorId
//     );

//     res.status(200).json({
//       success: true,
//       data: stats,
//     });
//   } catch (error) {
//     logger.error("Controller Error: getDashboardStats", error);
//     next(error);
//   }
// };

// exports.getDashboardAnalytics = async (req, res, next) => {
//   try {
//     const vendorId = req.user._id;

//     const data = await dashboardService.getDashboardAnalytics(
//       req.query,
//       vendorId
//     );

//     res.status(200).json({
//       success: true,
//       data,
//     });
//   } catch (error) {
//     logger.error("Controller Error: getDashboardAnalytics", error);
//     next(error);
//   }
// };

// exports.getRecentBookings = async (req, res, next) => {
//   try {
//     const vendorId = req.user._id;

//     const result = await dashboardService.getRecentBookings(
//       req.query,
//       vendorId
//     );

//     res.status(200).json({
//       success: true,
//       ...result,
//     });
//   } catch (error) {
//     logger.error("Controller Error: getRecentBookings", error);
//     next(error);
//   }
// };

const dashboardService = require("./dashboard.service");
const logger = require("../../../shared/utils/logger");
const Vendor = require("../../vendors/vendor.model");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    const stats = await dashboardService.getDashboardStats(req.query, vendor);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error("Controller Error: getDashboardStats", error);
    next(error);
  }
};

exports.getDashboardAnalytics = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    const data = await dashboardService.getDashboardAnalytics(
      req.query,
      vendor,
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getDashboardAnalytics", error);
    next(error);
  }
};

exports.getRecentBookings = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    const result = await dashboardService.getRecentBookings(req.query, vendor);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Controller Error: getRecentBookings", error);
    next(error);
  }
};
