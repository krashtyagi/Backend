import User from "./auth.model.js";
import Vendor from "../vendors/vendor.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import logger from "../../shared/utils/logger.js";
import {
  sendOTPEmail,
  sendWhatsAppOTP,
} from "../../shared/utils/sendEmail.js";
import { reconcileGuestBookings } from "../../shared/utils/reconcileGuestBookings.js";

// Helper to generate 6-digit OTP and its hash
const generateOTP = async () => {
  const otp = crypto.randomInt(1000, 9999).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return { otp, otpExpires };
};

// helper function to phone number
const normalizePhone = (phone: any) => {
  if (!phone) throw new Error("Phone number is required");

  // remove spaces, dashes, etc
  phone = phone.replace(/\D/g, "");

  // case 1: 10 digit (9876543210)
  if (phone.length === 10) {
    return `+91${phone}`;
  }

  // case 2: 12 digit (919876543210)
  if (phone.length === 12 && phone.startsWith("91")) {
    return `+${phone}`;
  }

  // case 3: already with country but without +
  if (phone.length > 10 && !phone.startsWith("91")) {
    throw new Error("Invalid phone number format");
  }

  // case 4: fallback invalid
  throw new Error("Invalid phone number");
};

export const whatsappSignup = async (phone: any, password: any) => {
  try {
    if (!phone) throw new Error("Phone number is required");

    const phoneNumber = normalizePhone(phone);

    let user = await User.findOne({ phoneNumber });

    if (user && user.providers.local.isVerified) {
      throw new Error("User already exists. Please login.");
    }

    const { otp, otpExpires } = await generateOTP();

    if (!user) {
      user = new User({
        phoneNumber,
        password,
        role: "user",
        otp,
        otpExpires,
        providers: {
          local: { isVerified: false },
        },
      });
    } else {
      if (password) user.password = password;

      user.otp = otp;
      user.otpExpires = otpExpires;
      user.providers.local.isVerified = false;
    }

    await user.save();

    // send WhatsApp OTP
    await sendWhatsAppOTP(phoneNumber, otp);

    return {
      message: "OTP sent on WhatsApp",
    };
  } catch (error) {
    throw error;
  }
};

export const whatsappVerify = async (phone: any, inputOTP: any) => {
  try {
    if (!phone) throw new Error("Phone number is required");

    const phoneNumber = normalizePhone(phone);

    const user = await User.findOne({ phoneNumber }).select("+otp +otpExpires");

    if (!user) throw new Error("User not found");

    if (!user.otpExpires || Date.now() > new Date(user.otpExpires).getTime()) {
      throw new Error("OTP expired. Please try again.");
    }

    if (String(inputOTP) !== String(user.otp)) {
      throw new Error("Invalid OTP");
    }

    user.providers.local.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return {
      message: "Verification successful",
      user,
    };
  } catch (error) {
    throw error;
  }
};

export const whatsappLogin = async (phone: any, password: any) => {
  try {
    if (!phone) throw new Error("Phone number is required");

    const phoneNumber = normalizePhone(phone);

    const user = await User.findOne({ phoneNumber }).select("+password");

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.password) {
      throw new Error("Please set a password first");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    if (!user.providers.local.isVerified) {
      throw new Error("Account not verified. Please verify OTP first.");
    }

    // Reconcile any guest bookings made with this user's email/phone
    await reconcileGuestBookings(user._id.toString(), user.email);

    return {
      user,
      message: "Login successful",
    };

  } catch (error) {
    throw error;
  }
};

export const forgotPasswordWhatsapp = async (phone: any) => {
  try {
    if (!phone) throw new Error("Phone number is required");

    const phoneNumber = normalizePhone(phone);

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      throw new Error("User not found");
    }

    const { otp, otpExpires } = await generateOTP();

    user.otp = otp;
    user.otpExpires = otpExpires;

    await user.save();

    await sendWhatsAppOTP(phoneNumber, otp);

    return {
      message: "OTP sent on WhatsApp",
    };
  } catch (error) {
    throw error;
  }
};

export const verifyForgotPasswordOtp = async (phone: any, inputOTP: any) => {
  try {
    if (!phone) throw new Error("Phone number is required");

    const phoneNumber = normalizePhone(phone);

    const user = await User.findOne({ phoneNumber }).select("+otp +otpExpires");

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.otpExpires || Date.now() > new Date(user.otpExpires).getTime()) {
      throw new Error("OTP expired");
    }

    if (String(inputOTP) !== String(user.otp)) {
      throw new Error("Invalid OTP");
    }

    return {
      message: "OTP verified successfully",
    };
  } catch (error) {
    throw error;
  }
};

export const resetPasswordWhatsapp = async (phone: any, inputOTP: any, newPassword: any) => {
  try {
    if (!phone) throw new Error("Phone number is required");

    const phoneNumber = normalizePhone(phone);

    const user = await User.findOne({ phoneNumber }).select(
      "+otp +otpExpires +password"
    );

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.otpExpires || Date.now() > new Date(user.otpExpires).getTime()) {
      throw new Error("OTP expired");
    }

    if (String(inputOTP) !== String(user.otp)) {
      throw new Error("Invalid OTP");
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return {
      message: "Password reset successfully",
    };
  } catch (error) {
    throw error;
  }
};

export const signup = async (email: any, password: any, role: any, firstName: any, lastName: any, phoneNumber: any) => {
  try {
    const allowedRoles = ["user", "vendor", "admin"];

    if (role && !allowedRoles.includes(role)) {
      throw new Error("Invalid role");
    }

    await User.deleteOne({
      email,
      "providers.local.isVerified": false,
    });

    let user = await User.findOne({ email });

    if (user && user.providers.local.isVerified) {
      throw new Error("Email already registered. Please login.");
    }

    const { otp, otpExpires } = await generateOTP();

    const signupExpires = new Date(Date.now() + 5 * 60 * 1000);

    if (!user) {
      user = new User({
        email,
        password,
        role: role || "user",
        firstName,
        lastName,
        phoneNumber,
        otp,
        otpExpires,
        signupExpires,
        otpAttempts: 0,
        isVendor: role === "vendor",
        providers: {
          local: { isVerified: false },
        },
      });
    } else {
      if (password) user.password = password;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.phoneNumber = phoneNumber || user.phoneNumber;

      user.otp = otp;
      user.otpExpires = otpExpires;
      user.signupExpires = signupExpires;
      user.otpAttempts = 0;
      user.providers.local.isVerified = false;
    }

    await user.save();
    await sendOTPEmail(email, otp);

    return {
      message: "OTP sent to your email for verification",
    };
  } catch (error) {
    logger.error("Service Error: signup", error);
    throw error;
  }
};

export const login = async (email: any, password: any) => {
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new Error("Invalid credentials");

    if (!user.password) throw new Error("Please use social login");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Invalid credentials");

    if (!user.providers.local.isVerified) {
      throw new Error("Account not verified. Please verify your OTP.");
    }

    // Reconcile any guest bookings made with this user's email
    await reconcileGuestBookings(user._id.toString(), user.email);

    return { user, message: "Login successful" };
  } catch (error) {
    throw error;
  }
};

export const resendOTP = async (email: any) => {
  try {
    const { otp, otpExpires } = await generateOTP();
    const user = await User.findOneAndUpdate(
      { email },
      { otp, otpExpires },
      { new: true },
    );

    if (!user) throw new Error("User not found");

    await sendOTPEmail(email, otp);
    return { message: "OTP sent successfully" };
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = async (email: any, inputOTP: any) => {
  try {
    const user = await User.findOne({ email }).select(
      "+otp +otpExpires +otpAttempts +signupExpires",
    );

    if (!user) throw new Error("User not found");

    // Signup expiry check (5 min)
    if (!user.signupExpires || Date.now() > new Date(user.signupExpires).getTime()) {
      await User.deleteOne({ _id: user._id });
      throw new Error("Signup expired. Please signup again.");
    }

    // OTP expiry check
    if (!user.otpExpires || Date.now() > new Date(user.otpExpires).getTime()) {
      await User.deleteOne({ _id: user._id });
      throw new Error("OTP expired. Please signup again.");
    }

    // Attempt limit check (before comparing)
    if (user.otpAttempts >= 3) {
      await User.deleteOne({ _id: user._id });
      throw new Error("Too many attempts. Please signup again.");
    }

    // OTP match check
    if (String(inputOTP) !== String(user.otp)) {
      user.otpAttempts += 1;

      // if reached 3 attempts → delete user
      if (user.otpAttempts >= 3) {
        await User.deleteOne({ _id: user._id });
        throw new Error("Too many incorrect attempts. Please signup again.");
      }

      await user.save();

      throw new Error(`Invalid OTP. Attempts left: ${3 - user.otpAttempts}`);
    }

    user.providers.local.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    user.signupExpires = undefined;

    await user.save();

    // Reconcile any guest bookings made with this user's email
    await reconcileGuestBookings(user._id.toString(), user.email);


    let vendor = null;

    if (user.role === "vendor") {
      vendor = await Vendor.findOne({ userId: user._id });

      if (!vendor) {
        vendor = await Vendor.create({
          userId: user._id,
          serviceType: undefined,
          status: "draft",
          currentStep: 1,
          registrationStep: 1,
        });
      }
    }

    return {
      user,
      vendor,
      message: "Verification successful",
    };
  } catch (error) {
    throw error;
  }
};

const findUserByEmailOrPhoneWithSelect = async (emailOrPhone: any, selectFields: any = "") => {
  if (!emailOrPhone) throw new Error("Email or Phone number is required");
  const isEmail = emailOrPhone.includes("@");
  const target = isEmail ? emailOrPhone : normalizePhone(emailOrPhone);
  const filter = isEmail ? { email: target } : { phoneNumber: target };

  const query = User.findOne(filter);
  if (selectFields) {
    query.select(selectFields);
  }
  const user = await query;
  if (!user) throw new Error("User not found");

  return { user, isEmail, target };
};

export const forgotPassword = async (emailOrPhone: any) => {
  try {
    const { user, isEmail, target } = await findUserByEmailOrPhoneWithSelect(
      emailOrPhone,
      ""
    );
    const { otp, otpExpires } = await generateOTP();
    user.otp = otp;
    user.otpExpires = otpExpires;
    user.otpAttempts = 0;
    await user.save();

    if (isEmail) {
      await sendOTPEmail(target, otp);
    } else {
      await sendWhatsAppOTP(target, otp);
    }

    return {
      message: isEmail
        ? "OTP sent to your email for password reset"
        : "OTP sent to your WhatsApp for password reset",
    };
  } catch (error) {
    throw error;
  }
};

export const otpVerify = async (emailOrPhone: any, inputOTP: any) => {
  try {
    const { user } = await findUserByEmailOrPhoneWithSelect(
      emailOrPhone,
      "+otp +otpExpires +otpAttempts",
    );

    if (!user.otpExpires || Date.now() > new Date(user.otpExpires).getTime()) {
      throw new Error("OTP expired");
    }

    if (String(inputOTP) !== String(user.otp)) {
      throw new Error("Invalid OTP");
    }

    return { message: "OTP verified successfully" };
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (emailOrPhone: any, otp: any, newPassword: any) => {
  try {
    const { user } = await findUserByEmailOrPhoneWithSelect(
      emailOrPhone,
      "+otp +otpExpires +otpAttempts +password",
    );

    if (!user.otpExpires || Date.now() > new Date(user.otpExpires).getTime()) {
      throw new Error("OTP expired");
    }

    if (String(otp) !== String(user.otp)) {
      throw new Error("Invalid OTP");
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;

    await user.save();

    return {
      message: "Password reset successful",
    };
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (userId: any, oldPassword: any, newPassword: any) => {
  try {
    const user = await User.findById(userId).select("+password");
    if (!user) throw new Error("User not found");

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) throw new Error("Old password is incorrect");

    user.password = newPassword;
    await user.save();

    return { message: "Password changed successfully" };
  } catch (error) {
    throw error;
  }
};

const generateToken = (userId: any) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET || "",
    { expiresIn: "7d" }
  );
};

export const emailSignup = async ({ email, password }: any) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const existingUser = await User.findOne({ email });

  if (
    existingUser &&
    existingUser.providers?.local?.isVerified
  ) {
    throw new Error("User already exists");
  }

  const { otp, otpExpires } = await generateOTP();
  const signupExpires = new Date(Date.now() + 10 * 60 * 1000);
  let user = existingUser;
  if (!user) {
    user = await User.create({
      email,
      password,
      otp,
      otpExpires,
      signupExpires,
    });
  } else {
    user.password = password;
    user.otp = otp;
    user.otpExpires = otpExpires;

    await user.save();
  }
  await sendOTPEmail(email, otp);

  return {
    message: "OTP sent successfully",
  };
};

export const emailVerifySignupOTP = async ({ email, otp }: any) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const user = await User.findOne({ email }).select(
    "+otp +otpExpires"
  );

  if (!user) {
    throw new Error("User not found");
  }

  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (user.otpExpires && new Date(user.otpExpires).getTime() < Date.now()) {
    throw new Error("OTP expired");
  }

  user.providers.local.isVerified = true;

  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();

  // Reconcile any guest bookings made with this user's email
  await reconcileGuestBookings(user._id.toString(), user.email);


  const accessToken = generateToken(user._id);

  return {
    message: "Otp verification successful",
    accessToken,
    data: {
      user,
    },
  };
};

export const emailResendOTP = async (email: any) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email }).select(
    "+otp +otpExpires"
  );

  if (!user) {
    throw new Error("User not found");
  }

  const { otp, otpExpires } = await generateOTP();

  user.otp = otp;
  user.otpExpires = otpExpires;

  await user.save();

  await sendOTPEmail(email, otp);

  return {
    message: "OTP resent successfully",
  };
};

export const emailLogin = async ({ email, password }: any) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email })
    .select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.providers.local.isVerified) {
    throw new Error("Please verify your account");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Reconcile any guest bookings made with this user's email
  await reconcileGuestBookings(user._id.toString(), user.email);

  const accessToken = generateToken(user._id);


  return {
    message: "Login successful",
    accessToken,
    data: {
      user,
    },
  };
};

export class AuthService {
  async whatsappSignup(phone: any, password: any) {
    return whatsappSignup(phone, password);
  }

  async whatsappVerify(phone: any, inputOTP: any) {
    return whatsappVerify(phone, inputOTP);
  }

  async whatsappLogin(phone: any, password: any) {
    return whatsappLogin(phone, password);
  }

  async forgotPasswordWhatsapp(phone: any) {
    return forgotPasswordWhatsapp(phone);
  }

  async verifyForgotPasswordOtp(phone: any, inputOTP: any) {
    return verifyForgotPasswordOtp(phone, inputOTP);
  }

  async resetPasswordWhatsapp(phone: any, inputOTP: any, newPassword: any) {
    return resetPasswordWhatsapp(phone, inputOTP, newPassword);
  }

  async signup(email: any, password: any, role: any, firstName: any, lastName: any, phoneNumber: any) {
    return signup(email, password, role, firstName, lastName, phoneNumber);
  }

  async login(email: any, password: any) {
    return login(email, password);
  }

  async resendOTP(email: any) {
    return resendOTP(email);
  }

  async verifyOTP(email: any, inputOTP: any) {
    return verifyOTP(email, inputOTP);
  }

  async forgotPassword(emailOrPhone: any) {
    return forgotPassword(emailOrPhone);
  }

  async otpVerify(emailOrPhone: any, inputOTP: any) {
    return otpVerify(emailOrPhone, inputOTP);
  }

  async resetPassword(emailOrPhone: any, otp: any, newPassword: any) {
    return resetPassword(emailOrPhone, otp, newPassword);
  }

  async changePassword(userId: any, oldPassword: any, newPassword: any) {
    return changePassword(userId, oldPassword, newPassword);
  }

  async emailSignup(payload: any) {
    return emailSignup(payload);
  }

  async emailVerifySignupOTP(payload: any) {
    return emailVerifySignupOTP(payload);
  }

  async emailResendOTP(email: any) {
    return emailResendOTP(email);
  }

  async emailLogin(payload: any) {
    return emailLogin(payload);
  }
}

export const authService = new AuthService();

export default authService;

