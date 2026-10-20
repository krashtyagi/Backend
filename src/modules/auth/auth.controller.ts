import { Request, Response, NextFunction } from "express";
import authService from "./auth.service.js";
import Hotel from "../hotels/hotel.model.js";
import Vendor from "../vendors/vendor.model.js";
import CabCompany from "../cab/company/cab.model.js";
import BikeCompany from "../bike/company/bike.model.js";
import TourCompany from "../tour/company/tour.model.js";
import Adventure from "../adventure/category/adventure.model.js";
import logger from "../../shared/utils/logger.js";
import { generateTokens } from "../../shared/utils/jwt.js";
import { reconcileGuestBookings } from "../../shared/utils/reconcileGuestBookings.js";

export class AuthController {
  // Helper function to set refresh token cookie
  private setTokenCookie(res: Response, refreshToken: string): void {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  // Helper to filter user data (Strictly avoid sending password/otp)
  private filterUserData(user: any) {
    return {
      id: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.providers?.local?.isVerified || false,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  // Unified Error Handler for Controllers
  private handleError(res: Response, error: any, status = 400): Response {
    logger.error(`Auth Error: ${error.message}`);
    return res.status(status).json({ success: false, message: error.message });
  }

  public socialAuthSuccess = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = (
        (req as any).user?._id || (req as any).user?.id
      )?.toString();
      const userEmail = (req as any).user?.email;

      // Reconcile any guest bookings made with this user's email
      if (userId && userEmail) {
        await reconcileGuestBookings(userId, userEmail);
      }

      const { accessToken, refreshToken } = generateTokens(userId);
      this.setTokenCookie(res, refreshToken);
      res.redirect(
        `${process.env.FRONTEND_URL}/auth-callback?token=${accessToken}`,
      );
    } catch (error: any) {
      logger.error("Social Auth Success Error:", error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  };

  public signup = async (
    req: Request,
    res: Response,
  ): Promise<void | Response> => {
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

      return res.status(201).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  public login = async (
    req: Request,
    res: Response,
  ): Promise<void | Response> => {
    try {
      const { email, password } = req.body;

      const { user, message } = await authService.login(email, password);

      // DEFAULT
      let vendorId: any = null;

      let extraData: Record<string, any> = {};

      // VENDOR CHECK
      if (user.role === "vendor") {
        const vendor: any = await Vendor.findOne({
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
          let business: any = null;

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
      const { accessToken, refreshToken } = generateTokens(
        user._id.toString(),
        vendorId ? vendorId.toString() : null,
      );

      // SET COOKIE
      this.setTokenCookie(res, refreshToken);

      return res.status(200).json({
        success: true,

        message,

        accessToken,

        data: {
          user: this.filterUserData(user),

          ...extraData,
        },
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,

        message: error.message,
      });
    }
  };

  public resendOTP = async (
    req: Request,
    res: Response,
  ): Promise<void | Response> => {
    try {
      const result = await authService.resendOTP(req.body.email);
      return res.status(200).json({ success: true, message: result.message });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  };

  public verifyOTP = async (
    req: Request,
    res: Response,
  ): Promise<void | Response> => {
    try {
      const { email, otp } = req.body;

      const { user, vendor, message } = await authService.verifyOTP(email, otp);

      const { accessToken, refreshToken } = generateTokens(user._id.toString());

      this.setTokenCookie(res, refreshToken);

      return res.status(200).json({
        success: true,
        message,
        accessToken,
        data: {
          user: this.filterUserData(user),
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
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  public forgotPassword = async (
    req: Request,
    res: Response,
  ): Promise<void | Response> => {
    try {
      const { phone, email } = req.body;

      const result = await authService.forgotPassword(phone || email);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  public otpVerify = async (
    req: Request,
    res: Response,
  ): Promise<void | Response> => {
    try {
      const { phone, email, otp } = req.body;

      const result = await authService.otpVerify(phone || email, otp);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  public resetPassword = async (
    req: Request,
    res: Response,
  ): Promise<void | Response> => {
    try {
      const { phone, email, otp, newPassword } = req.body;

      const result = await authService.resetPassword(
        phone || email,
        otp,
        newPassword,
      );

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  public changePassword = async (
    req: Request,
    res: Response,
  ): Promise<void | Response> => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = (req as any).user?.id || (req as any).user?._id;
      const result = await authService.changePassword(
        userId,
        oldPassword,
        newPassword,
      );
      return res.status(200).json({ success: true, message: result.message });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  };

  // WhatsApp auth

  public whatsappSignup = async (
    req: Request,
    res: Response,
  ): Promise<void | Response> => {
    try {
      const { phone, password } = req.body;

      const result = await authService.whatsappSignup(phone, password);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  public whatsappVerify = async (
    req: Request,
    res: Response,
  ): Promise<void | Response> => {
    try {
      const { phone, otp } = req.body;

      const { user, message } = await authService.whatsappVerify(phone, otp);

      const { accessToken, refreshToken } = generateTokens(user._id.toString());
      this.setTokenCookie(res, refreshToken);

      return res.status(200).json({
        success: true,
        message,
        accessToken,
        data: {
          user: this.filterUserData(user),
        },
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  public whatsappLogin = async (
    req: Request,
    res: Response,
  ): Promise<void | Response> => {
    try {
      const { phone, password } = req.body;

      const { user, message } = await authService.whatsappLogin(phone, password);

      const { accessToken, refreshToken } = generateTokens(user._id.toString());
      this.setTokenCookie(res, refreshToken);

      return res.status(200).json({
        success: true,
        message,
        accessToken,
        data: {
          user: this.filterUserData(user),
        },
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  };

  public forgotPasswordWhatsapp = async (
    req: Request,
    res: Response,
  ): Promise<void | Response> => {
    try {
      const { phone } = req.body;

      const result = await authService.forgotPasswordWhatsapp(phone);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  public verifyForgotPasswordOtp = async (
    req: Request,
    res: Response,
  ): Promise<void | Response> => {
    try {
      const { phone, otp } = req.body;

      const result = await authService.verifyForgotPasswordOtp(phone, otp);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  public resetPasswordWhatsapp = async (
    req: Request,
    res: Response,
  ): Promise<void | Response> => {
    try {
      const { phone, otp, newPassword } = req.body;

      const result = await authService.resetPasswordWhatsapp(
        phone,
        otp,
        newPassword,
      );

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  public emailSignup = async (
    req: Request,
    res: Response,
  ): Promise<void | Response> => {
    try {
      const result = await authService.emailSignup(req.body);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  public emailVerifySignupOTP = async (
    req: Request,
    res: Response,
  ): Promise<void | Response> => {
    try {
      const result = await authService.emailVerifySignupOTP(req.body);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  public emailResendOTP = async (
    req: Request,
    res: Response,
  ): Promise<void | Response> => {
    try {
      const result = await authService.emailResendOTP(req.body.email);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  public emailLogin = async (
    req: Request,
    res: Response,
  ): Promise<void | Response> => {
    try {
      const result = await authService.emailLogin(req.body);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}