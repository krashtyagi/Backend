const taxService = require("./tax.service");

exports.setTax = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { taxPercentage } = req.body;

    const tax = await taxService.setTax(userId, taxPercentage);

    res.status(200).json({
      success: true,
      message: "Tax updated successfully",
      data: tax,
    });
  } catch (error) {
    next(error);
  }
};

exports.getActiveTax = async (req, res, next) => {
  try {
    const tax = await taxService.getActiveTax();

    res.status(200).json({
      success: true,
      data: tax,
    });
  } catch (error) {
    next(error);
  }
};