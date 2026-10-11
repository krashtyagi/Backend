import { Router } from "express";
import { AccountController } from "./account.controller";
import { protect } from "src/shared/middlewares/verifyToken";
import { authorize } from "src/shared/middlewares/roleMiddleware";

const router = Router();
const accountController = new AccountController();

router.get(
  "/delete-requests",
  protect,
  authorize("admin"),
  accountController.getDeleteRequests,
);

router.patch(
  "/:userId/approve-delete",
  protect,
  authorize("admin"),
  accountController.approveDeleteRequest,
);

router.patch(
  "/:userId/reject-delete",
  protect,
  authorize("admin"),
  accountController.rejectDeleteRequest,
);

export default router;
