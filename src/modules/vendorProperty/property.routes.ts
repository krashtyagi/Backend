import { Router } from "express";
import { VendorPropertyController } from "./property.controller.js";
import { protect } from "../../shared/middlewares/verifyToken.js";
import { authorize } from "../../shared/middlewares/roleMiddleware.js";

const router = Router();
const controller = new VendorPropertyController();

// ─── Vendor Routes ─────────────────────────────────────────

// List all properties for the authenticated vendor
router.get(
  "/",
  protect,
  authorize("vendor"),
  controller.getVendorProperties,
);

// Get currently active property details
router.get(
  "/active",
  protect,
  authorize("vendor"),
  controller.getActiveProperty,
);

// Add a new property (hotel/tour) to existing vendor
router.post(
  "/add",
  protect,
  authorize("vendor"),
  controller.addVendorProperty,
);

// Switch the active property
router.post(
  "/switch",
  protect,
  authorize("vendor"),
  controller.switchActiveProperty,
);

export default router;
