import { Router } from "express";
import { ReviewController } from "./review.controller";
import { protect } from "../../shared/middlewares/verifyToken";
import { authorize } from "../../shared/middlewares/roleMiddleware";

const router = Router();
const controller = new ReviewController();

// Public
// Company Reviews
//type+companyid
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

export default router;
