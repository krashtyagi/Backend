const User = require("./auth.model");
const Vendor = require("../vendors/vendor.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const logger = require("../../shared/utils/logger");
const {
  sendOTPEmail,
  sendWhatsAppOTP,
} = require("../../shared/utils/sendEmail");

// Helper to generate 6-digit OTP and its hash
const generateOTP = async () => {
  const otp = crypto.randomInt(1000, 9999).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return { otp, otpExpires };
};

//helper function to phone number
const normalizePhone = (phone) => {
  if (!phone) throw new Error("Phone number is required");

  //remove spaces, dashes, etc
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

exports.whatsappSignup = async (phone, password) => {
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

    //send WhatsApp OTP
    await sendWhatsAppOTP(phoneNumber, otp);

    return {
      message: "OTP sent on WhatsApp",
    };
  } catch (error) {
    throw error;
  }
};

exports.whatsappVerify = async (phone, inputOTP) => {
  try {
    if (!phone) throw new Error("Phone number is required");

    const phoneNumber = normalizePhone(phone);

    const user = await User.findOne({ phoneNumber }).select("+otp +otpExpires");

    if (!user) throw new Error("User not found");

    if (!user.otpExpires || Date.now() > user.otpExpires) {
      throw new Error("OTP expired");
    }

    if (String(inputOTP) !== String(user.otp)) {
      throw new Error("Invalid OTP");
    }

    user.providers.local.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return {
      user,
      message: "Verification successful",
    };
  } catch (error) {
    throw error;
  }
};

exports.whatsappLogin = async (phone, password) => {
  try {
    if (!phone) throw new Error("Phone number is required");

    const phoneNumber = normalizePhone(phone);

    const user = await User.findOne({ phoneNumber }).select("+password");

    if (!user) throw new Error("Invalid credentials");

    if (!user.password) {
      throw new Error("Please login using OTP");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Invalid credentials");

    if (!user.providers.local.isVerified) {
      throw new Error("Account not verified. Please verify your OTP.");
    }

    return {
      user,
      message: "Login successful",
    };
  } catch (error) {
    throw error;
  }
};

exports.forgotPasswordWhatsapp = async (phone) => {
  if (!phone) {
    throw new Error("Phone number is required");
  }

  const phoneNumber = normalizePhone(phone);

  const user = await User.findOne({ phoneNumber });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.providers.local.isVerified) {
    throw new Error("Account not verified");
  }

  const { otp, otpExpires } = await generateOTP();

  user.otp = otp;
  user.otpExpires = otpExpires;
  user.otpAttempts = 0;

  await user.save();

  await sendWhatsAppOTP(phoneNumber, otp);

  return {
    message: "Password reset OTP sent on WhatsApp",
  };
};

exports.verifyForgotPasswordOtp = async (phone, inputOTP) => {
  if (!phone) {
    throw new Error("Phone number is required");
  }

  const phoneNumber = normalizePhone(phone);

  const user = await User.findOne({
    phoneNumber,
  }).select("+otp +otpExpires +otpAttempts");

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.otpExpires || Date.now() > user.otpExpires) {
    throw new Error("OTP expired");
  }

  if (String(user.otp) !== String(inputOTP)) {
    user.otpAttempts += 1;
    await user.save();

    throw new Error("Invalid OTP");
  }

  return {
    message: "OTP verified successfully",
  };
};

exports.resetPasswordWhatsapp = async (phone, inputOTP, newPassword) => {
  if (!phone) {
    throw new Error("Phone number is required");
  }

  if (!newPassword) {
    throw new Error("New password is required");
  }

  const phoneNumber = normalizePhone(phone);

  const user = await User.findOne({
    phoneNumber,
  }).select("+otp +otpExpires +password +otpAttempts");

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.otpExpires || Date.now() > user.otpExpires) {
    throw new Error("OTP expired");
  }

  if (String(user.otp) !== String(inputOTP)) {
    user.otpAttempts += 1;
    await user.save();

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
};

exports.signup = async (email, password, role, firstName, lastName, phoneNumber) => {
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

    const signupExpires = Date.now() + 5 * 60 * 1000;

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

exports.login = async (email, password) => {
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new Error("Invalid credentials");

    if (!user.password) throw new Error("Please use social login");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Invalid credentials");

    if (!user.providers.local.isVerified) {
      throw new Error("Account not verified. Please verify your OTP.");
    }

    return { user, message: "Login successful" };
  } catch (error) {
    throw error;
  }
};

exports.resendOTP = async (email) => {
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

exports.verifyOTP = async (email, inputOTP) => {
  try {
    const user = await User.findOne({ email }).select(
      "+otp +otpExpires +otpAttempts +signupExpires",
    );

    if (!user) throw new Error("User not found");

    //Signup expiry check (5 min)
    if (!user.signupExpires || Date.now() > user.signupExpires) {
      await User.deleteOne({ _id: user._id });
      throw new Error("Signup expired. Please signup again.");
    }

    //OTP expiry check
    if (!user.otpExpires || Date.now() > user.otpExpires) {
      await User.deleteOne({ _id: user._id });
      throw new Error("OTP expired. Please signup again.");
    }

    //Attempt limit check (before comparing)
    if (user.otpAttempts >= 3) {
      await User.deleteOne({ _id: user._id });
      throw new Error("Too many attempts. Please signup again.");
    }

    //OTP match check
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

    let vendor = null;

    if (user.role === "vendor") {
      vendor = await Vendor.findOne({ userId: user._id });

      if (!vendor) {
        vendor = await Vendor.create({
          userId: user._id,
          serviceType: null,
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

const findUserByEmailOrPhoneWithSelect = async (emailOrPhone, selectFields) => {
  if (!emailOrPhone) throw new Error("Email or Phone number is required");
  const isEmail = emailOrPhone.includes("@");
  if (isEmail) {
    let query = User.findOne({ email: emailOrPhone });
    if (selectFields) query = query.select(selectFields);
    const user = await query;
    if (!user) throw new Error("User not found");
    return { user, isEmail, target: emailOrPhone };
  } else {
    const phoneNumber = normalizePhone(emailOrPhone);
    let query = User.findOne({ phoneNumber });
    if (selectFields) query = query.select(selectFields);
    const user = await query;
    if (!user) throw new Error("User not found");
    return { user, isEmail, target: phoneNumber };
  }
};

exports.forgotPassword = async (emailOrPhone) => {
  try {
    const { user, isEmail, target } = await findUserByEmailOrPhoneWithSelect(emailOrPhone);

    const { otp, otpExpires } = await generateOTP();

    user.otp = otp;
    user.otpExpires = otpExpires;

    await user.save();

    if (isEmail) {
      await sendOTPEmail(target, otp);
      return { message: "Password reset OTP sent to your email" };
    } else {
      await sendWhatsAppOTP(target, otp);
      return { message: "Password reset OTP sent on WhatsApp" };
    }
  } catch (error) {
    throw error;
  }
};

exports.otpVerify = async (emailOrPhone, inputOTP) => {
  try {
    const { user } = await findUserByEmailOrPhoneWithSelect(emailOrPhone, "+otp +otpExpires");

    if (
      !user.otp ||
      String(user.otp) !== String(inputOTP) ||
      Date.now() > user.otpExpires
    ) {
      throw new Error("Invalid or expired OTP");
    }

    return { message: "OTP verified successfully" };
  } catch (error) {
    throw error;
  }
};

exports.resetPassword = async (emailOrPhone, otp, newPassword) => {
  try {
    const { user } = await findUserByEmailOrPhoneWithSelect(emailOrPhone, "+otp +otpExpires");

    if (
      !user.otp ||
      String(user.otp) !== String(otp) ||
      Date.now() > user.otpExpires
    ) {
      throw new Error("Invalid or expired OTP");
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return { message: "Password reset successful" };
  } catch (error) {
    throw error;
  }
};

exports.changePassword = async (userId, oldPassword, newPassword) => {
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


const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "7d" }
  );
};

exports.emailSignup = async ({ email, password }) => {
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

  const otp = generateOTPByEmail();
  let user = existingUser;
  if (!user) {
    user = await User.create({
      email,
      password,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
      signupExpires: Date.now() + 10 * 60 * 1000,
    });
  } else {
    user.password = password;
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;

    await user.save();
  }
  await  sendOTPEmail(email , otp);

  return {
    message: "OTP sent successfully",
  };
};

exports.emailVerifySignupOTP = async ({ email, otp }) => {
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

  if (user.otpExpires < Date.now()) {
    throw new Error("OTP expired");
  }

  user.providers.local.isVerified = true;

  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();

  const accessToken = generateToken(user._id);

  return {
    message: "Otp verification successful",
    accessToken,
    data: {
      user,
    },
  };
};

exports.emailResendOTP = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email }).select(
    "+otp +otpExpires"
  );

  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOTP();

  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;

  await user.save();

  await sendEmailOTP(email, otp);

  return {
    message: "OTP resent successfully",
  };
};

exports.emailLogin = async ({ email, password }) => {
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

  const accessToken = generateToken(user._id);

  return {
    message: "Login successful",
    accessToken,
    data: {
      user,
    },
  };
};
