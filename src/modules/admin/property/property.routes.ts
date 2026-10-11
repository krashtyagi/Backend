import { Router } from "express";
import { PropertyController } from "./property.controller";
import { protect } from "src/shared/middlewares/verifyToken";
import { authorize } from "src/shared/middlewares/roleMiddleware";

const router = Router();
const propertyController = new PropertyController();

// GET all properties
router.get(
  "/",
  protect,
  authorize("admin"),
  propertyController.getAllProperties,
);

//rank
router.patch(
  "/:id/rank",
  protect,
  authorize("admin"),
  propertyController.updateBusinessRank,
);

// listings (rooms for hotel, packages for tour)
router.get(
  "/:vendorId/listings",
  protect,
  authorize("admin"),
  propertyController.getPropertyListings,
);

// Deleted property archive / trash
router.get(
  "/deleted",
  protect,
  authorize("admin"),
  propertyController.getDeletedProperties,
);

router.delete(
  "/deleted/clean-all",
  protect,
  authorize("admin"),
  propertyController.cleanAllDeletedProperties,
);

router.delete(
  "/deleted/:id",
  protect,
  authorize("admin"),
  propertyController.deleteDeletedPropertyRecord,
);

router.get(
  "/:vendorId",
  protect,
  authorize("admin"),
  propertyController.getPropertyDetail,
);

router.patch(
  "/:vendorId/mark-issue",
  protect,
  authorize("admin"),
  propertyController.markIssue,
);

router.patch(
  "/:vendorId/verify",
  protect,
  authorize("admin"),
  propertyController.verifySection,
);

router.patch(
  "/:vendorId/reject",
  protect,
  authorize("admin"),
  propertyController.rejectVendor,
);

router.patch(
  "/:vendorId/approve",
  protect,
  authorize("admin"),
  propertyController.approveVendor,
);

// Block vendor / property
router.patch(
  "/:vendorId/block",
  protect,
  authorize("admin"),
  propertyController.blockVendor,
);

// Unblock vendor / property
router.patch(
  "/:vendorId/unblock",
  protect,
  authorize("admin"),
  propertyController.unblockVendor,
);

// Delete property / vendor
router.delete(
  "/:vendorId",
  protect,
  authorize("admin"),
  propertyController.deleteProperty,
);

export default router;
