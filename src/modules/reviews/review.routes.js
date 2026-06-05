const express = require("express");
const router = express.Router();

const controller = require("./review.controller");

const { protect } = require("../../shared/middlewares/verifyToken");
const { authorize } = require("../../shared/middlewares/roleMiddleware");

// Public
// Company Reviews
//tpye+companyid
router.get("/:companyType/:companyId", controller.getCompanyReviews);

// User side... 
// Eligible + Submitted Reviews
router.get("/", protect, controller.getUserReviews);

//Create Review
router.post("/", protect, controller.createReview);

// update Review
router.put("/:reviewId", protect, controller.updateReview);

// Vendor side...
// Get Vendor Reviews
router.get(
  "/vendor",
  protect,
  authorize("vendor"),
  controller.getVendorReviews,
);

// Vendor Reply
router.post(
  "/vendor/reply/:reviewId",
  protect,
  authorize("vendor"),
  controller.vendorReply,
);

module.exports = router;
