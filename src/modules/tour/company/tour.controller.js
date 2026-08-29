const tourService = require("./tour.service");
const logger = require("../../../shared/utils/logger");
const Vendor = require("../../vendors/vendor.model");

exports.createTourCompany = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // FIND VENDOR
    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const tour = await tourService.createTourCompany(req.body, vendor);

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
    logger.error("Controller Error: createTourCompany", error);
    next(error);
  }
};

exports.getTourCompanies = async (req, res, next) => {
  try {
    const result = await tourService.getAllTourCompanies(req.query);

    res.status(200).json({
      success: true,
      count: result.companies.length,
      total: result.total,
      data: result.companies,
      page: result.page,
      limit: result.limit,
    });
  } catch (error) {
    logger.error("Controller Error: getTourCompanies", error);
    next(error);
  }
};

exports.getTourCompanyById = async (req, res, next) => {
  try {
    const data = await tourService.getTourCompanyById(req.params.id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getTourCompanyById", error);
    next(error);
  }
};

exports.getTourCompaniesGroupedByCity = async (req, res, next) => {
  try {
    const data = await tourService.getTourCompaniesGroupedByCity();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("Controller Error: getTourCompaniesGroupedByCity", error);
    next(error);
  }
};
