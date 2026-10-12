import { Request, Response, NextFunction } from "express";
import Vendor from "./vendor.model.js";
import bookingService from "../bookings/booking.service.js";
import roomTypeService from "../rooms/roomType.service.js";
import vendorService from "./vendor.service.js";
import logger from "../../shared/utils/logger.js";
import uploadService from "../upload/upload.service.js";
import User from "../auth/auth.model.js";

import Hotel from "../hotels/hotel.model.js";
import TourCompany from "../tour/company/tour.model.js";
import CabCompany from "../cab/company/cab.model.js";
import BikeCompany from "../bike/company/bike.model.js";
import Adventure from "../adventure/category/adventure.model.js";

const SERVICE_MODELS: Record<string, any> = {
  hotel: Hotel,
  tour: TourCompany,
  cab: CabCompany,
  bike: BikeCompany,
  adventure: Adventure,
};

export class VendorController {
  // get me help for prefilling data
  async getVendorMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user._id;

      const data = await vendorService.getVendorMe(userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: getVendorMe", error);
      next(error);
    }
  }

  // vendor profile create step-2
  async createVendorProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user._id;

      const vendor = await vendorService.createVendorProfile(userId, req.body);

      res.status(200).json({
        success: true,
        message: "Step 2 saved successfully",
        data: {
          currentStep: vendor.currentStep,
          registrationStep: vendor.registrationStep,
          status: vendor.status,
        },
      });
    } catch (error) {
      logger.error("Controller Error: createVendorProfile", error);
      next(error);
    }
  }

  // final step of registration step-5
  async submitVendor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user._id;

      const vendor = await Vendor.findOne({ userId });

      if (!vendor) {
        throw new Error("Vendor profile not found");
      }

      const updatedVendor = await vendorService.submitVendor(vendor);

      res.status(200).json({
        success: true,
        message: "Submitted successfully. Waiting for admin approval.",
        data: {
          status: updatedVendor.status,
          currentStep: updatedVendor.currentStep,
        },
      });
    } catch (error) {
      logger.error("Controller Error: submitVendor", error);
      next(error);
    }
  }

  // get booking list in dashboard-vendor
  async getVendorBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });

      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({
          success: false,
          message: "Vendor not approved or not found",
        });
        return;
      }

      const result = await bookingService.getVendorBookings(
        vendor._id,
        req.query,
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error("Vendor Booking List Error:", error);
      next(error);
    }
  }

  // get booking detail in dashboard-vendor
  async getVendorBookingDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });

      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({
          success: false,
          message: "Vendor not approved or not found",
        });
        return;
      }

      const booking = await roomTypeService.getVendorBookingDetail(
        req.params.id,
        vendor._id,
      );

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      logger.error("Vendor Booking Detail Error:", error);
      next(error);
    }
  }

  // get in dashboard room type controller
  async getVendorRoomTypes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });

      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({
          success: false,
          message: "Vendor not approved or not found",
        });
        return;
      }

      const result = await roomTypeService.getVendorRoomTypes(
        vendor._id,
        req.query,
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error("Vendor RoomType List Error:", error);
      next(error);
    }
  }

  // get room type detail in dashboard-vendor
  async getVendorRoomTypeDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });

      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({
          success: false,
          message: "Vendor not approved or not found",
        });
        return;
      }

      const result = await roomTypeService.getVendorRoomTypeDetail(
        req.params.id,
        vendor._id,
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Vendor RoomType Detail Error:", error);
      next(error);
    }
  }

  // invoice
  async getVendorInvoices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });

      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({
          success: false,
          message: "Vendor not approved or not found",
        });
        return;
      }

      const result = await bookingService.getVendorInvoices(
        vendor._id,
        req.query,
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error("Vendor Invoice List Error:", error);
      next(error);
    }
  }

  // invoice download vendor
  async downloadInvoicePdf(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });

      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({
          success: false,
          message: "Vendor not authorized",
        });
        return;
      }

      await bookingService.generateInvoicePdf(
        req.params.bookingId,
        vendor._id,
        res,
      );
    } catch (error) {
      logger.error("Download Invoice Error:", error);
      next(error);
    }
  }

  // vendor dashboard
  async getVendorDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendor: any = await Vendor.findOne({ userId: (req as any).user._id })
        .select("_id status")
        .lean();
      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({
          success: false,
          message: "Vendor not authorized",
        });
        return;
      }

      const reservationDays = parseInt(req.query.reservationDays as string) || 7;
      const revenueMonths = parseInt(req.query.revenueMonths as string) || 6;

      const data = await bookingService.getVendorDashboard(
        vendor._id,
        reservationDays,
        revenueMonths,
      );
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Dashboard Error:", error);
      next(error);
    }
  }

  // user check-in
  async checkInBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });

      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({ message: "Unauthorized vendor" });
        return;
      }

      const result = await bookingService.checkInBooking(
        req.params.id,
        vendor._id,
      );

      res.status(200).json({ success: true, data: result });
    } catch (err) {
      logger.error("Check-in Error:", err);
      next(err);
    }
  }

  // user staying
  async markBookingStaying(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });

      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({ message: "Unauthorized vendor" });
        return;
      }

      const result = await bookingService.markBookingStaying(
        req.params.id,
        vendor._id,
      );

      res.status(200).json({ success: true, data: result });
    } catch (err) {
      logger.error("Staying Error:", err);
      next(err);
    }
  }

  // user check-out
  async checkOutBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendor = await Vendor.findOne({ userId: (req as any).user._id });

      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({ message: "Unauthorized vendor" });
        return;
      }

      const result = await bookingService.checkOutBooking(
        req.params.id,
        vendor._id,
      );

      res.status(200).json({ success: true, data: result });
    } catch (err) {
      logger.error("Check-out Error:", err);
      next(err);
    }
  }

  // Get vendor's my listing data
  async getVendorMyListing(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user._id;

      const data = await vendorService.getVendorMyListing(userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: getVendorMyListing", error);
      next(error);
    }
  }

  async applyForPromotion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const { plan } = req.body;

      if (!plan) {
        res.status(400).json({
          success: false,
          message: "Plan name is required",
        });
        return;
      }

      const validPlans = ["Boost", "Premium", "Elite"];
      if (!validPlans.includes(plan)) {
        res.status(400).json({
          success: false,
          message: "Invalid plan. Choose between Boost, Premium, or Elite",
        });
        return;
      }

      const data = await vendorService.applyForPromotion(userId, plan);

      res.status(201).json({
        success: true,
        message: "Promotion request submitted successfully",
        data,
      });
    } catch (error) {
      logger.error("Controller Error: applyForPromotion", error);
      next(error);
    }
  }

  async getMyPromotionRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user._id;

      const data = await vendorService.getMyPromotionRequests(userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: getMyPromotionRequests", error);
      next(error);
    }
  }

  async updateVendorLogo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const { logo } = req.body;

      const vendor = await Vendor.findOne({ userId });
      if (!vendor) {
        res.status(404).json({
          success: false,
          message: "Vendor profile not found",
        });
        return;
      }

      const oldPublicId = vendor.logo?.public_id;
      const newPublicId = typeof logo === "object" ? logo?.public_id : null;

      if (typeof logo === "string") {
        vendor.logo = { url: logo, public_id: "", resource_type: "image" };
      } else if (logo && logo.url) {
        vendor.logo = logo;
      } else if (logo === null || logo === "") {
        vendor.logo = undefined;
      }

      await vendor.save();

      // If there was an old logo and it changed/removed, delete old from Cloudinary
      if (oldPublicId && oldPublicId !== newPublicId) {
        uploadService.deleteFile(oldPublicId, "image").catch((err: any) => {
          logger.error("Failed to delete previous vendor logo from Cloudinary:", err);
        });
      }

      if (vendor.logo?.url) {
        await User.findByIdAndUpdate(userId, { avatar: vendor.logo.url });
      }

      res.status(200).json({
        success: true,
        message: "Company logo updated successfully",
        data: { logo: vendor.logo },
      });
    } catch (error) {
      logger.error("Controller Error: updateVendorLogo", error);
      next(error);
    }
  }

  async updateAdvertisementImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const { advertisementImage } = req.body;

      const vendor = await Vendor.findOne({ userId });
      if (!vendor) {
        res.status(404).json({
          success: false,
          message: "Vendor profile not found",
        });
        return;
      }

      const ServiceModel = vendor.serviceType ? (SERVICE_MODELS as any)[vendor.serviceType] : null;
      if (!ServiceModel) {
        res.status(400).json({
          success: false,
          message: `Unsupported service type: ${vendor.serviceType}`,
        });
        return;
      }

      const serviceData: any = await ServiceModel.findOne({
        vendorId: vendor._id,
        isActive: true,
      });

      if (!serviceData) {
        res.status(404).json({
          success: false,
          message: "Property listing not found for this vendor",
        });
        return;
      }

      const oldPublicId = serviceData.advertisementImage?.public_id;
      const newPublicId = typeof advertisementImage === "object" ? advertisementImage?.public_id : null;

      if (typeof advertisementImage === "string") {
        serviceData.advertisementImage = {
          url: advertisementImage,
          public_id: "",
          resource_type: "image",
        };
      } else if (advertisementImage && advertisementImage.url) {
        serviceData.advertisementImage = advertisementImage;
      } else if (advertisementImage === null || advertisementImage === "") {
        serviceData.advertisementImage = undefined;
      }

      await serviceData.save();

      // Clean up old image if changed
      if (oldPublicId && oldPublicId !== newPublicId) {
        try {
          uploadService.deleteFile(oldPublicId, "image").catch((err: any) => {
            logger.error("Failed to delete previous advertisement image from Cloudinary:", err);
          });
        } catch (err) {
          // ignore
        }
      }

      res.status(200).json({
        success: true,
        message: "Advertisement banner image updated successfully",
        data: { advertisementImage: serviceData.advertisementImage || null },
      });
    } catch (error) {
      logger.error("Controller Error: updateAdvertisementImage", error);
      next(error);
    }
  }

  async getPropertySettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const data = await vendorService.getPropertySettings(userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Controller Error: getPropertySettings", error);
      next(error);
    }
  }

  async updatePropertySettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user._id;
      const data = await vendorService.updatePropertySettings(userId, req.body);

      res.status(200).json({
        success: true,
        message: "Property settings updated successfully",
        data,
      });
    } catch (error) {
      logger.error("Controller Error: updatePropertySettings", error);
      next(error);
    }
  }
}

export const vendorController = new VendorController();

// Bound handler exports for route use and backward compatibility
export const getVendorMe = vendorController.getVendorMe.bind(vendorController);
export const createVendorProfile = vendorController.createVendorProfile.bind(vendorController);
export const submitVendor = vendorController.submitVendor.bind(vendorController);
export const getVendorBookings = vendorController.getVendorBookings.bind(vendorController);
export const getVendorBookingDetail = vendorController.getVendorBookingDetail.bind(vendorController);
export const getVendorRoomTypes = vendorController.getVendorRoomTypes.bind(vendorController);
export const getVendorRoomTypeDetail = vendorController.getVendorRoomTypeDetail.bind(vendorController);
export const getVendorInvoices = vendorController.getVendorInvoices.bind(vendorController);
export const downloadInvoicePdf = vendorController.downloadInvoicePdf.bind(vendorController);
export const getVendorDashboard = vendorController.getVendorDashboard.bind(vendorController);
export const checkInBooking = vendorController.checkInBooking.bind(vendorController);
export const markBookingStaying = vendorController.markBookingStaying.bind(vendorController);
export const checkOutBooking = vendorController.checkOutBooking.bind(vendorController);
export const getVendorMyListing = vendorController.getVendorMyListing.bind(vendorController);
export const applyForPromotion = vendorController.applyForPromotion.bind(vendorController);
export const getMyPromotionRequests = vendorController.getMyPromotionRequests.bind(vendorController);
export const updateVendorLogo = vendorController.updateVendorLogo.bind(vendorController);
export const updateAdvertisementImage = vendorController.updateAdvertisementImage.bind(vendorController);
export const getPropertySettings = vendorController.getPropertySettings.bind(vendorController);
export const updatePropertySettings = vendorController.updatePropertySettings.bind(vendorController);

export default vendorController;

