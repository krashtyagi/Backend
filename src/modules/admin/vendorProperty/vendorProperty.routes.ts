import { Router } from "express";
import { VendorPropertyController } from "../../vendorProperty/property.controller.js";
import { protect } from "../../../shared/middlewares/verifyToken.js";
import { authorize } from "../../../shared/middlewares/roleMiddleware.js";

const router = Router();
const controller = new VendorPropertyController();

// ─── Admin Routes for Additional Property Management ───────

// Get all pending additional properties
router.get(
  "/pending",
  protect,
  authorize("admin"),
  controller.getPendingAdditionalProperties,
);

// Approve an additional property
router.post(
  "/:id/approve",
  protect,
  authorize("admin"),
  controller.approveAdditionalProperty,
);

// Reject an additional property
router.post(
  "/:id/reject",
  protect,
  authorize("admin"),
  controller.rejectAdditionalProperty,
);

export default router;
