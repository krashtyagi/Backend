const reviewService = require("./review.service");
const logger = require("../../shared/utils/logger");

// Public
exports.getCompanyReviews = async (req, res, next) => {
  try {
    const result = await reviewService.getCompanyReviews(
      req.params.companyType,
      req.params.companyId,
      req.query,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getCompanyReviews", error);

    next(error);
  }
};

//user side
exports.getUserReviews = async (req, res, next) => {
  try {
    const result = await reviewService.getUserReviews(req.user._id, req.query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getUserReviews", error);

    next(error);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const result = await reviewService.createReview(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.review,
    });
  } catch (error) {
    logger.error("Controller Error: createReview", error);

    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const result = await reviewService.updateReview(
      req.user._id,
      req.params.reviewId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.review,
    });
  } catch (error) {
    logger.error("Controller Error: updateReview", error);

    next(error);
  }
};

//vendor side

exports.getVendorReviews = async (req, res, next) => {
  try {
    const result = await reviewService.getVendorReviews(
      req.vendorId,
      req.query,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorReviews", error);

    next(error);
  }
};

exports.vendorReply = async (req, res, next) => {
  try {
    const result = await reviewService.vendorReply(
      req.vendorId,
      req.params.reviewId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.review,
    });
  } catch (error) {
    logger.error("Controller Error: vendorReply", error);

    next(error);
  }
};
