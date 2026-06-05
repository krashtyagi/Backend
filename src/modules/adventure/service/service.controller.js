const logger = require("../../../shared/utils/logger");
const serviceService = require("./service.service");
const Vendor = require("../../vendors/vendor.model");

exports.getServiceDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || null;

    const data = await serviceService.getServiceDetails(id, userId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getServiceDetails", error);
    next(error);
  }
};

exports.getVendorServices = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const services = await serviceService.getVendorServices(vendor._id);

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorServices", error);
    next(error);
  }
};

exports.getVendorServiceById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const serviceId = req.params.id;

    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const service = await serviceService.getVendorServiceById(
      serviceId,
      vendor._id,
    );

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorServiceById", error);
    next(error);
  }
};

exports.createService = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const vendor = await Vendor.findOne({
      userId,
    });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const service = await serviceService.createService(req.body, vendor._id);

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    logger.error("Controller Error: createService", error);
    next(error);
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const serviceId = req.params.id;

    const vendor = await Vendor.findOne({
      userId,
    });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const service = await serviceService.updateService(
      serviceId,
      req.body,
      vendor._id,
    );

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    logger.error("Controller Error: updateService", error);
    next(error);
  }
};

exports.deleteService = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const serviceId = req.params.id;

    const vendor = await Vendor.findOne({
      userId,
    });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    await serviceService.deleteService(serviceId, vendor._id);

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    logger.error("Controller Error: deleteService", error);
    next(error);
  }
};
