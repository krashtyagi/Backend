const reviewService = require("./review.service");
const logger = require("../../../shared/utils/logger");

exports.getReviewStats = async (req, res, next) => {
  try {
    const result = await reviewService.getReviewStats();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getReviewStats", error);

    next(error);
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    const result = await reviewService.getAllReviews(req.query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getAllReviews", error);

    next(error);
  }
};

exports.getReviewDetail = async (req, res, next) => {
  try {
    const result = await reviewService.getReviewDetail(req.params.reviewId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getReviewDetail", error);

    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const result = await reviewService.deleteReview(req.params.reviewId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error("Controller Error: deleteReview", error);

    next(error);
  }
};

exports.flagReview = async (req, res, next) => {
  try {
    const result = await reviewService.flagReview(
      req.params.reviewId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.review,
    });
  } catch (error) {
    logger.error("Controller Error: flagReview", error);

    next(error);
  }
};
