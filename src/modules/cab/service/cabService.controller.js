const cabService = require("./cabService.service");
const logger = require("../../../shared/utils/logger");
const Vendor = require("../../vendors/vendor.model");

//user side...
exports.getCabs = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;
    const data = await cabService.getCabs(req.query, userId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getCabs", error);
    next(error);
  }
};

exports.getCabCompanyDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || null;

    const data = await cabService.getCabCompanyDetails(id, userId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getCabCompanyDetails", error);
    next(error);
  }
};

exports.getCabServiceDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || null;

    const data = await cabService.getCabServiceDetails(id, userId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getCabServiceDetails", error);
    next(error);
  }
};

//vendor side....
exports.createCabService = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const vendor = await Vendor.findOne({
      userId,
    });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const service = await cabService.createCabService(req.body, vendor._id);

    res.status(201).json({
      success: true,

      message: "Cab service created successfully",

      data: service,
    });
  } catch (error) {
    logger.error("Controller Error: createCabService", error);

    next(error);
  }
};

exports.getVendorCabServices = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const vendor = await Vendor.findOne({
      userId,
    });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const result = await cabService.getVendorCabServices(req.query, vendor._id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorCabServices", error);
    next(error);
  }
};

exports.getVendorCabServiceById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const serviceId = req.params.id;

    const vendor = await Vendor.findOne({
      userId,
    });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const service = await cabService.getVendorCabServiceById(
      serviceId,
      vendor._id,
    );

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorCabServiceById", error);
    next(error);
  }
};

exports.updateVendorCabService = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const serviceId = req.params.id;

    const vendor = await Vendor.findOne({
      userId,
    });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const updated = await cabService.updateVendorCabService(
      serviceId,
      vendor._id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Cab service updated successfully",
      data: updated,
    });
  } catch (error) {
    logger.error("Controller Error: updateCabService", error);
    next(error);
  }
};

exports.deleteVendorCabService = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const serviceId = req.params.id;

    const vendor = await Vendor.findOne({
      userId,
    });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    await cabService.deleteVendorCabService(serviceId, vendor._id);

    res.status(200).json({
      success: true,
      message: "Cab service deleted successfully",
    });
  } catch (error) {
    logger.error("Controller Error: deleteCabService", error);
    next(error);
  }
};
