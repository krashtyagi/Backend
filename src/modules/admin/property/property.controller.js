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
    const { rank } = req.body;
    const { id } = req.params;

    if (!rank) {
      return res.status(400).json({
        success: false,
        message: "Rank is required",
      });
    }

    const updatedHotel = await propertyService.updateBusinessRank(id, rank);

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
