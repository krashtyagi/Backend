const express = require("express");
const router = express.Router();

const propertyController = require("./property.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

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

module.exports = router;
