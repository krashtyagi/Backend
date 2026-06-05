const User = require("../auth/auth.model");
const logger = require("../../shared/utils/logger");

exports.getUserProfile = async (userId) => {
  return await User.findById(userId).select("-otp -otpExpires");
};

exports.updateUserProfile = async (userId, updateData) => {
  // Block email updates for security
  if (updateData.email) {
    throw new Error("Email cannot be updated");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true },
  ).select("-otp -otpExpires");

  return updatedUser;
};

exports.deleteAccountRequest = async (userId, body) => {
  try {
    const { reason } = body;

    const user = await User.findOne({
      _id: userId,
      role: "user",
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.deleteRequest?.status === "pending") {
      throw new Error("Account deletion request already submitted");
    }

    user.deleteRequest = {
      status: "pending",
      requestedAt: new Date(),
      reason: reason || "",
    };

    await user.save();

    return {
      success: true,
      message: "Account deletion request submitted successfully",
    };
  } catch (error) {
    logger.error("Service Error: deleteAccountRequest", error);

    throw error;
  }
};
