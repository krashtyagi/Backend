const vendorAccountService = require("./accountGroup.service");

exports.connectVendorAccounts = async (req, res) => {
  try {
    const currentVendorId = req.vendorId;
    const { email, password } = req.body;

    const result = await vendorAccountService.connectVendorAccounts(
      currentVendorId,
      email,
      password,
    );

    return res.status(200).json({
      success: true,

      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

exports.getConnectedAccounts = async (req, res) => {
  try {
    const currentVendorId = req.vendorId;

    const accounts =
      await vendorAccountService.getConnectedAccounts(currentVendorId);

    return res.status(200).json({
      success: true,

      data: accounts,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

exports.switchVendorAccount = async (req, res) => {
  try {
    const currentVendorId = req.vendorId;

    const { targetVendorId } = req.body;

    const result = await vendorAccountService.switchVendorAccount(
      currentVendorId,
      targetVendorId,
    );

    return res.status(200).json({
      success: true,

      message: "Account switched successfully",

      accessToken: result.accessToken,

      vendor: result.vendor,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};
