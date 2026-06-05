const tourService = require("./tourService.service");
const logger = require("../../../shared/utils/logger");
const Vendor = require("../../vendors/vendor.model");
//user side

exports.getTours = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;
    const data = await tourService.getTours(req.query, userId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getTours", error);
    next(error);
  }
};

exports.getCompanyDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || null;

    const data = await tourService.getCompanyDetails(id, userId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getCompanyDetails", error);
    next(error);
  }
};

exports.getTourServiceDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || null;

    const data = await tourService.getTourServiceDetails(id, userId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getTourServiceDetails", error);
    next(error);
  }
};



//vendor side
exports.createTourService = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const vendor = await Vendor.findOne({
      userId,
    });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const service = await tourService.createTourService(req.body, vendor._id);

    res.status(201).json({
      success: true,
      message: "Tour service created successfully",
      data: service,
    });
  } catch (error) {
    logger.error("Controller Error: createTourService", error);
    next(error);
  }
};

exports.getVendorTourServices = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const vendor = await Vendor.findOne({
      userId,
    });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const result = await tourService.getVendorTourServices(req.query, vendor._id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorTourServices", error);
    next(error);
  }
};

exports.getVendorTourServiceById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const serviceId = req.params.id;

    const vendor = await Vendor.findOne({
      userId,
    });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const service = await tourService.getVendorTourServiceById(
      serviceId,
      vendor._id,
    );

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorTourServiceById", error);
    next(error);
  }
};

exports.updateVendorTourService = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const serviceId = req.params.id;

    const vendor = await Vendor.findOne({
      userId,
    });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const updated = await tourService.updateVendorTourService(
      serviceId,
      vendor._id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Tour service updated successfully",
      data: updated,
    });
  } catch (error) {
    logger.error("Controller Error: updateTourService", error);
    next(error);
  }
};

exports.deleteVendorTourService = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const serviceId = req.params.id;

    const vendor = await Vendor.findOne({
      userId,
    });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    await tourService.deleteVendorTourService(serviceId, vendor._id);

    res.status(200).json({
      success: true,
      message: "Tour service deleted successfully",
    });
  } catch (error) {
    logger.error("Controller Error: deleteTourService", error);
    next(error);
  }
};
