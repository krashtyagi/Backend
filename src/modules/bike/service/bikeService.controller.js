const bikeService = require("./bikeService.service");
const logger = require("../../../shared/utils/logger");
const Vendor = require("../../vendors/vendor.model");
//user side
exports.getBikes = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;
    const data = await bikeService.getBikes(req.query, userId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getBikes", error);
    next(error);
  }
};

exports.getBikeCompanyDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || null;

    const data = await bikeService.getBikeCompanyDetails(id, userId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getBikeCompanyDetails", error);
    next(error);
  }
};

exports.getBikeServiceDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || null;

    const data = await bikeService.getBikeServiceDetails(id, userId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getBikeServiceDetails", error);
    next(error);
  }
};

exports.calculateBikePrice = async (req, res, next) => {
  try {
    const data = await bikeService.calculateBikePrice(req.body);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: calculateBikePrice", error);
    next(error);
  }
};

//vendor side
exports.createBikeService = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const vendor = await Vendor.findOne({
      userId,
    });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const service = await bikeService.createBikeService(req.body, vendor._id);

    res.status(201).json({
      success: true,
      message: "Bike service created successfully",
      data: service,
    });
  } catch (error) {
    logger.error("Controller Error: createBikeService", error);
    next(error);
  }
};

exports.getVendorBikeServices = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const vendor = await Vendor.findOne({
      userId,
    });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const result = await bikeService.getVendorBikeServices(req.query, vendor._id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorBikeServices", error);
    next(error);
  }
};

exports.getVendorBikeServiceById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const serviceId = req.params.id;

    const vendor = await Vendor.findOne({
      userId,
    });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const service = await bikeService.getVendorBikeServiceById(
      serviceId,
      vendor._id,
    );

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorBikeServiceById", error);
    next(error);
  }
};

exports.updateVendorBikeService = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const serviceId = req.params.id;

    const vendor = await Vendor.findOne({
      userId,
    });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const updated = await bikeService.updateVendorBikeService(
      serviceId,
      vendor._id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Bike service updated successfully",
      data: updated,
    });
  } catch (error) {
    logger.error("Controller Error: updateBikeService", error);
    next(error);
  }
};

exports.deleteVendorBikeService = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const serviceId = req.params.id;

    const vendor = await Vendor.findOne({
      userId,
    });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    await bikeService.deleteVendorBikeService(serviceId, vendor._id);

    res.status(200).json({
      success: true,
      message: "Bike service deleted successfully",
    });
  } catch (error) {
    logger.error("Controller Error: deleteBikeService", error);
    next(error);
  }
};
