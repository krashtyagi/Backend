const bankService = require("./bank.service");
const Vendor = require("../vendors/vendor.model");
const logger = require("../../shared/utils/logger");

//Create vendor bank details
exports.createBankDetails = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const bank = await bankService.createBankDetails(
      vendor,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Step 3 saved successfully",
      data: {
        currentStep: vendor.currentStep,
        registrationStep: vendor.registrationStep,
        status: vendor.status,
      },
    });
  } catch (error) {
    logger.error("Controller Error: createBankDetails", error);
    next(error);
  }
};