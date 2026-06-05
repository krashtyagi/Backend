const userService = require("./user.service");
const logger = require("../../shared/utils/logger");

exports.getMe = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const user = await userService.updateUserProfile(req.user.id, req.body);
    logger.info(`Profile updated for user: ${user.email}`);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteAccountRequest = async (req, res, next) => {
  try {
    const result = await userService.deleteAccountRequest(
      req.user.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error("Controller Error: deleteAccountRequest", error);

    next(error);
  }
};
