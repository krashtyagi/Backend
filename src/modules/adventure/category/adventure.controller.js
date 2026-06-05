const logger = require("../../../shared/utils/logger");
const Vendor = require("../../vendors/vendor.model");
const adventureService = require("./adventure.service");

exports.searchAdventures = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;
    const categories = await adventureService.searchAdventures(req.query, userId);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    logger.error("Controller Error: searchAdventures", error);
    next(error);
  }
};

exports.getAdventures = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;
    const adventures = await adventureService.getAdventures(req.query, userId);

    res.status(200).json({
      success: true,
      count: adventures.length,
      data: adventures,
    });
  } catch (error) {
    logger.error("Controller Error: getAdventures", error);
    next(error);
  }
};

exports.getAdventureDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || null;

    const data = await adventureService.getAdventureDetails(id, userId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getAdventureDetails", error);
    next(error);
  }
};

///vendor

exports.createAdventure = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // FIND VENDOR
    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const adventure = await adventureService.createAdventure(req.body, vendor);

    res.status(200).json({
      success: true,
      message: "Step 4 completed successfully",
      data: {
        currentStep: vendor.currentStep,
        registrationStep: vendor.registrationStep,
        status: vendor.status,
        // adventure,
      },
    });
  } catch (error) {
    logger.error("Controller Error: createAdventure", error);
    next(error);
  }
};

exports.getVendorAdventures = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const adventures = await adventureService.getVendorAdventures(vendor._id);

    res.status(200).json({
      success: true,
      count: adventures.length,
      data: adventures,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorAdventures", error);
    next(error);
  }
};

exports.getVendorAdventureDetails = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const data = await adventureService.getVendorAdventureDetails(id, vendor._id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorAdventureDetails", error);
    next(error);
  }
};

exports.updateAdventure = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const adventure = await adventureService.updateAdventure(
      id,
      req.body,
      vendor._id,
    );

    res.status(200).json({
      success: true,
      data: adventure,
    });
  } catch (error) {
    logger.error("Controller Error: updateAdventure", error);
    next(error);
  }
};

exports.deleteAdventure = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    await adventureService.deleteAdventure(id, vendor._id);

    res.status(200).json({
      success: true,
      message: "Adventure deleted successfully",
    });
  } catch (error) {
    logger.error("Controller Error: deleteAdventure", error);
    next(error);
  }
};
