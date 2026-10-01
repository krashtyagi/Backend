const propertyService = require("./property.service");
const logger = require("../../../shared/utils/logger");

//all vendor property list
exports.getAllProperties = async (req, res, next) => {
  try {
    const result = await propertyService.getAllProperties(req.query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getAllProperties", error);
    next(error);
  }
};

exports.updateBusinessRank = async (req, res, next) => {
  try {
    const { rank, serviceType = "hotel" } = req.body;
    const { id } = req.params;

    if (!rank) {
      return res.status(400).json({
        success: false,
        message: "Rank is required",
      });
    }

    const updatedHotel = await propertyService.updateBusinessRank(serviceType, id, rank);

    res.status(200).json({
      success: true,
      message: "Business rank updated successfully",
      data: updatedHotel,
    });
  } catch (error) {
    logger.error("Controller Error: updateBusinessRank", error);

    next(error);
  }
};

//vendor property detail
exports.getPropertyDetail = async (req, res, next) => {
  try {
    const { vendorId } = req.params;

    const data = await propertyService.getPropertyDetail(vendorId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getPropertyDetail", error);
    next(error);
  }
};

//mark issue
exports.markIssue = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { step, reason } = req.body;

    const vendor = await propertyService.markIssue(
      vendorId,
      step,
      reason,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      message: "Issue marked successfully",
      data: {
        rejectedSteps: vendor.rejectedSteps,
        rejectionReasons: vendor.rejectionReasons,
        status: vendor.status,
      },
    });
  } catch (error) {
    logger.error("Controller Error: markIssue", error);
    next(error);
  }
};

//verfiy the steps
exports.verifySection = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { step } = req.body;

    const vendor = await propertyService.verifySection(
      vendorId,
      step,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      message: "Section verified successfully",
      data: {
        rejectedSteps: vendor.rejectedSteps,
        rejectionReasons: vendor.rejectionReasons,
        status: vendor.status,
      },
    });
  } catch (error) {
    logger.error("Controller Error: verifySection", error);
    next(error);
  }
};

//reject the steps
exports.rejectVendor = async (req, res, next) => {
  try {
    const { vendorId } = req.params;

    const vendor = await propertyService.rejectVendor(
      vendorId,
      req.body,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      message: "Vendor rejected successfully",
      data: {
        status: vendor.status,
        rejectedSteps: vendor.rejectedSteps,
        rejectionReasons: vendor.rejectionReasons,
      },
    });
  } catch (error) {
    logger.error("Controller Error: rejectVendor", error);
    next(error);
  }
};

//approve the vendor
exports.approveVendor = async (req, res, next) => {
  try {
    const { vendorId } = req.params;

    const vendor = await propertyService.approveVendor(vendorId, req.user._id);

    res.status(200).json({
      success: true,
      message: "Vendor approved successfully",
      data: {
        status: vendor.status,
      },
    });
  } catch (error) {
    logger.error("Controller Error: approveVendor", error);
    next(error);
  }
};

//get property listings (rooms for hotel, packages for tour)
exports.getPropertyListings = async (req, res, next) => {
  try {
    const { vendorId } = req.params;

    const data = await propertyService.getPropertyListings(vendorId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getPropertyListings", error);
    next(error);
  }
};

//block vendor / property
exports.blockVendor = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { reason } = req.body || {};

    const vendor = await propertyService.blockVendor(vendorId, req.user._id, reason);

    res.status(200).json({
      success: true,
      message: "Vendor blocked successfully",
      data: {
        status: vendor.status,
        isBlocked: vendor.isBlocked,
      },
    });
  } catch (error) {
    logger.error("Controller Error: blockVendor", error);
    next(error);
  }
};

//unblock vendor / property
exports.unblockVendor = async (req, res, next) => {
  try {
    const { vendorId } = req.params;

    const vendor = await propertyService.unblockVendor(vendorId, req.user._id);

    res.status(200).json({
      success: true,
      message: "Vendor unblocked successfully",
      data: {
        status: vendor.status,
        isBlocked: vendor.isBlocked,
      },
    });
  } catch (error) {
    logger.error("Controller Error: unblockVendor", error);
    next(error);
  }
};

//delete property / vendor
exports.deleteProperty = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { reason } = req.body || {};

    const result = await propertyService.deleteProperty(vendorId, req.user?._id, reason);

    res.status(200).json({
      success: true,
      message: result.message || "Property deleted successfully",
    });
  } catch (error) {
    logger.error("Controller Error: deleteProperty", error);
    next(error);
  }
};

//get deleted properties list
exports.getDeletedProperties = async (req, res, next) => {
  try {
    const data = await propertyService.getDeletedProperties(req.query);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getDeletedProperties", error);
    next(error);
  }
};

//clean all deleted records (trash empty)
exports.cleanAllDeletedProperties = async (req, res, next) => {
  try {
    const result = await propertyService.cleanAllDeletedProperties();

    res.status(200).json({
      success: true,
      data: result,
      message: result.message,
    });
  } catch (error) {
    logger.error("Controller Error: cleanAllDeletedProperties", error);
    next(error);
  }
};

//delete single deleted record permanently
exports.deleteDeletedPropertyRecord = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await propertyService.deleteDeletedPropertyRecord(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error("Controller Error: deleteDeletedPropertyRecord", error);
    next(error);
  }
};


