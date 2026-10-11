import User from "../auth/auth.model";
import logger from "../../shared/utils/logger";
import * as uploadService from "../upload/upload.service";

function getCloudinaryPublicId(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) return null;
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;
  const afterUpload = parts[1];
  const withoutVersion = afterUpload.replace(/^v\d+\//, "");
  const publicId = withoutVersion.replace(/\.[^/.]+$/, "");
  return publicId || null;
}

export const getUserProfile = async (userId: any) => {
  return await User.findById(userId).select("-otp -otpExpires");
};

export const updateUserProfile = async (userId: any, updateData: any) => {
  // Block email updates for security
  if (updateData.email) {
    throw new Error("Email cannot be updated");
  }

  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new Error("User not found");
  }

  const oldAvatar = existingUser.avatar;
  const newAvatar = updateData.avatar;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true },
  ).select("-otp -otpExpires");

  // If avatar was changed or removed, clean up old avatar from Cloudinary
  if (newAvatar !== undefined && oldAvatar && oldAvatar !== newAvatar) {
    const oldPublicId = getCloudinaryPublicId(oldAvatar);
    if (oldPublicId) {
      uploadService.deleteFile(oldPublicId, "image").catch((err: any) => {
        logger.error("Failed to delete previous user avatar from Cloudinary:", err);
      });
    }
  }

  return updatedUser;
};

export const deleteAccountRequest = async (userId: any, body: any) => {
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
    } as any;

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

export class UserService {
  async getUserProfile(userId: any) {
    return getUserProfile(userId);
  }

  async updateUserProfile(userId: any, updateData: any) {
    return updateUserProfile(userId, updateData);
  }

  async deleteAccountRequest(userId: any, body: any) {
    return deleteAccountRequest(userId, body);
  }
}

export const userService = new UserService();

export default userService;

