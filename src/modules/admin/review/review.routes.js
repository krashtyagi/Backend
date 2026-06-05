const express = require("express");
const router = express.Router();

const reviewController = require("./review.controller");

const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

// Review Dashboard Stats
router.get(
  "/stats",
  protect,
  authorize("admin"),
  reviewController.getReviewStats,
);

// All Reviews
router.get("/", protect, authorize("admin"), reviewController.getAllReviews);

// Review Detail
router.get(
  "/:reviewId",
  protect,
  authorize("admin"),
  reviewController.getReviewDetail,
);

// Delete Review
router.delete(
  "/:reviewId",
  protect,
  authorize("admin"),
  reviewController.deleteReview,
);

// Flag / Unflag Review
router.patch(
  "/:reviewId/flag",
  protect,
  authorize("admin"),
  reviewController.flagReview,
);

module.exports = router;
