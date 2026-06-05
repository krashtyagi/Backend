const paymentService = require("./payment.service");

exports.verifyPayment = async (req, res, next) => {
  try {
    const booking = await paymentService.verifyPayment(
      req.body
    );

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};
