const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const passport = require("passport");
const { protect } = require("../../shared/middlewares/verifyToken");
const rateLimit = require("express-rate-limit");

// Standard limiter for general auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: {
    success: false,
    message:
      "Too many attempts from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for OTP and Login
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 OTP requests per hour
  message: {
    success: false,
    message: "OTP limit exceeded, please try again after an hour",
  },
});

//whats app auth
router.post("/whatsapp-signup", authLimiter, authController.whatsappSignup);
router.post("/whatsapp-verify", authLimiter, authController.whatsappVerify);
router.post("/whatsapp-login", authLimiter, authController.whatsappLogin);

router.post(
  "/forgot-password-whatsapp",
  authLimiter,
  authController.forgotPasswordWhatsapp,
);

router.post(
  "/verify-forgot-password-otp",
  authLimiter,
  authController.verifyForgotPasswordOtp,
);

router.post(
  "/reset-password-whatsapp",
  authLimiter,
  authController.resetPasswordWhatsapp,
);

// Applied Routes
router.post("/resend-otp", otpLimiter, authController.resendOTP);
router.post("/verify-otp", authLimiter, authController.verifyOTP);
router.post("/signup", authLimiter, authController.signup);
router.post("/login", authLimiter, authController.login);

// Password Management
router.post("/forgot-password", otpLimiter, authController.forgotPassword);
router.post("/otp-verify", otpLimiter, authController.otpVerify);
router.patch("/reset-password", authLimiter, authController.resetPassword);
router.patch("/change-password", protect, authController.changePassword);







router.post("/email-signup", authController.emailSignup);

router.post("/email-verify-otp", authController.emailVerifySignupOTP);

router.post("/email-resend-otp", authController.emailResendOTP);

router.post("/email-login", authController.emailLogin);




//--social auth
// Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  authController.socialAuthSuccess,
);

// Facebook
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
    session: false,
  }),
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  authController.socialAuthSuccess,
);

// Apple
router.get("/apple", passport.authenticate("apple", { session: false }));

router.post(
  "/apple/callback",
  passport.authenticate("apple", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  authController.socialAuthSuccess,
);

module.exports = router;
