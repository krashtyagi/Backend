const bikeService = require("./bike.service");
const logger = require("../../../shared/utils/logger");
const Vendor = require("../../vendors/vendor.model");

exports.createBikeCompany = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // FIND VENDOR
    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const bike = await bikeService.createBikeCompany(req.body, vendor);
    
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
    logger.error("Controller Error: createBikeCompany", error);
    next(error);
  }
};
