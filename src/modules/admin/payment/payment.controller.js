const paymentService = require("./payment.service");
const logger = require("../../../shared/utils/logger");

// Get payment stats
exports.getPaymentStats = async (req, res, next) => {
  try {
    const result = await paymentService.getPaymentStats();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getPaymentStats", error);
    next(error);
  }
};

// Get all payments
exports.getAllPayments = async (req, res, next) => {
  try {
    const result = await paymentService.getAllPayments(req.query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getAllPayments", error);
    next(error);
  }
};

// Get payment detail
exports.getPaymentDetail = async (req, res, next) => {
  try {
    const result = await paymentService.getPaymentDetail(req.params.paymentId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getPaymentDetail", error);
    next(error);
  }
};

// Get payment analytics
exports.getPaymentAnalytics = async (req, res, next) => {
  try {
    const result = await paymentService.getPaymentAnalytics(req.query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getPaymentAnalytics", error);
    next(error);
  }
};

// Get refund requests
exports.getRefundRequests = async (req, res, next) => {
  try {
    const result = await paymentService.getRefundRequests(req.query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getRefundRequests", error);
    next(error);
  }
};

// Handle refund (approve / reject)
exports.handleRefund = async (req, res, next) => {
  try {
    const result = await paymentService.handleRefund(
      req.params.paymentId,
      req.body.action, // approve | reject
    );

    res.status(200).json({
      success: true,
      message: `Refund ${req.body.action} successfully`,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: handleRefund", error);
    next(error);
  }
};
