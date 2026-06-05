const cabService = require("./cab.service");
const Vendor = require("../../vendors/vendor.model");
const logger = require("../../../shared/utils/logger");

exports.createCabCompany = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // FIND VENDOR
    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    // CREATE / UPDATE CAB COMPANY
    const cab = await cabService.createCabCompany(vendor, req.body);

    res.status(200).json({
      success: true,
      message: "Step 4 completed successfully",
      data: {
        currentStep: vendor.currentStep,
        registrationStep: vendor.registrationStep,
        status: vendor.status,
        // cab,
      },
    });
  } catch (error) {
    logger.error("Controller Error: createCabCompany", error);

    next(error);
  }
};
