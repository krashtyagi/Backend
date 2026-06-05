const accountService = require("./account.service");
const logger = require("../../../shared/utils/logger");

exports.getDeleteRequests = async (req, res, next) => {
  try {
    const result = await accountService.getDeleteRequests(req.query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getDeleteRequests", error);

    next(error);
  }
};

exports.approveDeleteRequest = async (req, res, next) => {
  try {
    const result = await accountService.approveDeleteRequest(req.params.userId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error("Controller Error: approveDeleteRequest", error);

    next(error);
  }
};

exports.rejectDeleteRequest = async (req, res, next) => {
  try {
    const result = await accountService.rejectDeleteRequest(req.params.userId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error("Controller Error: rejectDeleteRequest", error);

    next(error);
  }
};
