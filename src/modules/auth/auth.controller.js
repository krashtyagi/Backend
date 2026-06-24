const authService = require("./auth.service");
const Hotel = require("../hotels/hotel.model");
const Vendor = require("../vendors/vendor.model");

const CabCompany = require("../cab/company/cab.model");
const BikeCompany = require("../bike/company/bike.model");
const TourCompany = require("../tour/company/tour.model");
const Adventure = require("../adventure/category/adventure.model");

const logger = require("../../shared/utils/logger");
const { generateTokens } = require("../../shared/utils/jwt");

// Helper function to set refresh token cookie
const setTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// Helper to filter user data (Strictly avoid sending password/otp)
const filterUserData = (user) => {
  return {
    id: user._id,
    email: user.email,
    role: user.role,
    isVerified: user.providers?.local?.isVerified || false,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};

// Unified Error Handler for Controllers
const handleError = (res, error, status = 400) => {
  logger.error(`Auth Error: ${error.message}`);
  return res.status(status).json({ success: false, message: error.message });
};

exports.socialAuthSuccess = async (req, res) => {
  try {
    const { accessToken, refreshToken } = generateTokens(req.user._id);
    setTokenCookie(res, refreshToken);
    res.redirect(
      `${process.env.FRONTEND_URL}/auth-callback?token=${accessToken}`,
    );
  } catch (error) {
    logger.error("Social Auth Success Error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

exports.signup = async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, phoneNumber } =
      req.body;

    const result = await authService.signup(
      email,
      password,
      role,
      firstName,
      lastName,
      phoneNumber,
    );

    res.status(201).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, message } = await authService.login(email, password);

    // DEFAULT
    let vendorId = null;

    let extraData = {};

    // VENDOR CHECK
    if (user.role === "vendor") {
      const vendor = await Vendor.findOne({
        userId: user._id,
      });

      if (vendor) {
        // SET VENDOR ID
        vendorId = vendor._id;

        extraData.vendor = {
          status: vendor.status,

          currentStep: vendor.currentStep,

          rejectedSteps: vendor.rejectedSteps || [],

          rejectionReasons: vendor.rejectionReasons || {},

          serviceType: vendor.serviceType,
        };

        // DYNAMIC BUSINESS FETCH
        let business = null;

        switch (vendor.serviceType) {
          case "hotel":
            business = await Hotel.findOne({
              vendorId: vendor._id,
            }).select("_id name");
            break;

          case "cab":
            business = await CabCompany.findOne({
              vendorId: vendor._id,
            }).select("_id name");
            break;

          case "bike":
            business = await BikeCompany.findOne({
              vendorId: vendor._id,
            }).select("_id name");
            break;

          case "tour":
            business = await TourCompany.findOne({
              vendorId: vendor._id,
            }).select("_id name");
            break;

          case "adventure":
            business = await Adventure.findOne({
              vendorId: vendor._id,
            }).select("_id name category");
            break;

          default:
            business = null;
        }

        if (vendor.status === "approved") {
          extraData.business = business;
        }
      }
    }

    // GENERATE TOKENS
    const { accessToken, refreshToken } = generateTokens(user._id, vendorId);

    // SET COOKIE
    setTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,

      message,

      accessToken,

      data: {
        user: filterUserData(user),

        ...extraData,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,

      message: error.message,
    });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const result = await authService.resendOTP(req.body.email);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const { user, vendor, message } = await authService.verifyOTP(email, otp);

    const { accessToken, refreshToken } = generateTokens(user._id);

    setTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      message,
      accessToken,
      data: {
        user: filterUserData(user),
        vendor: vendor
          ? {
              currentStep: vendor.currentStep,
              registrationStep: vendor.registrationStep,
              status: vendor.status,
              rejectedSteps: vendor.rejectedSteps || [],
              rejectionReasons: vendor.rejectionReasons || {},
            }
          : null,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { phone, email } = req.body;

    const result = await authService.forgotPassword(phone || email);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.otpVerify = async (req, res) => {
  try {
    const { phone, email, otp } = req.body;

    const result = await authService.otpVerify(phone || email, otp);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { phone, email, otp, newPassword } = req.body;

    const result = await authService.resetPassword(phone || email, otp, newPassword);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await authService.changePassword(
      req.user.id,
      oldPassword,
      newPassword,
    );
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//whats app auth

exports.whatsappSignup = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const result = await authService.whatsappSignup(phone, password);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.whatsappVerify = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const { user, message } = await authService.whatsappVerify(phone, otp);

    const { accessToken, refreshToken } = generateTokens(user._id);
    setTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      message,
      accessToken,
      data: {
        user: filterUserData(user),
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.whatsappLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const { user, message } = await authService.whatsappLogin(phone, password);

    const { accessToken, refreshToken } = generateTokens(user._id);
    setTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      message,
      accessToken,
      data: {
        user: filterUserData(user),
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

exports.forgotPasswordWhatsapp = async (req, res) => {
  try {
    const { phone } = req.body;

    const result = await authService.forgotPasswordWhatsapp(phone);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const result = await authService.verifyForgotPasswordOtp(phone, otp);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resetPasswordWhatsapp = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;

    const result = await authService.resetPasswordWhatsapp(
      phone,
      otp,
      newPassword,
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};









exports.emailSignup = async (req, res) => {
  try {
    const result = await authService.emailSignup(req.body);

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

exports.emailVerifySignupOTP = async (req, res) => {
  try {
    const result = await authService.emailVerifySignupOTP(req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
      accessToken: result.accessToken,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.emailResendOTP = async (req, res) => {
  try {
    const result = await authService.emailResendOTP(req.body.email);

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

exports.emailLogin = async (req, res) => {
  try {
    const result = await authService.emailLogin(req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
      accessToken: result.accessToken,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};