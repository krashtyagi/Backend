const policyService = require("./policy.service");
const Vendor = require("../vendors/vendor.model");
const Hotel = require("../hotels/hotel.model");
const logger = require("../../shared/utils/logger");

//Vendor: set policy
exports.setPolicy = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) throw new Error("Vendor profile not found");

    const hotel = await Hotel.findOne({
      _id: req.body.hotelId,
      vendorId: vendor._id,
    });

    if (!hotel) throw new Error("Unauthorized hotel access");

    const policy = await policyService.upsertPolicy(req.body.hotelId, req.body);

    res.status(200).json({
      success: true,
      message: "Hotel policy updated",
      data: policy,
    });
  } catch (error) {
    logger.error("Controller Error: setPolicy", error);
    next(error);
  }
};

//User: get policy
exports.getPolicy = async (req, res, next) => {
  try {
    const policy = await policyService.getPolicyByHotel(req.params.hotelId);

    res.status(200).json({
      success: true,
      data: policy,
    });
  } catch (error) {
    logger.error("Controller Error: getPolicy", error);
    next(error);
  }
};
