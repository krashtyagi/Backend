import { Router } from "express";
import { ReviewController } from "./review.controller.js";
import { protect } from "../../../shared/middlewares/verifyToken.js";
import { authorize } from "../../../shared/middlewares/roleMiddleware.js";

const router = Router();
const reviewController = new ReviewController();

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

export default router;
