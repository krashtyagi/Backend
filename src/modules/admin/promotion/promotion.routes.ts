import { Router } from "express";
import { PromotionController } from "./promotion.controller";
import { protect } from "src/shared/middlewares/verifyToken";
import { authorize } from "src/shared/middlewares/roleMiddleware";

const router = Router();
const promotionController = new PromotionController();

router.get(
  "/",
  protect,
  authorize("admin"),
  promotionController.getAllPromotionRequests,
);

router.post(
  "/assign",
  protect,
  authorize("admin"),
  promotionController.assignPropertyPromotion,
);

router.patch(
  "/:id/approve",
  protect,
  authorize("admin"),
  promotionController.approvePromotion,
);

router.patch(
  "/:id/rank",
  protect,
  authorize("admin"),
  promotionController.updatePromotionRank,
);

router.patch(
  "/:id/duration",
  protect,
  authorize("admin"),
  promotionController.updatePromotionDuration,
);

router.patch(
  "/:id/remove",
  protect,
  authorize("admin"),
  promotionController.removePromotion,
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  promotionController.removePromotion,
);

export default router;
