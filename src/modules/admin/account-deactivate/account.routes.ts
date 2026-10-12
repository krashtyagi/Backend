import { Router } from "express";
import { AccountController } from "./account.controller.js";
import { protect } from "../../../shared/middlewares/verifyToken.js";
import { authorize } from "../../../shared/middlewares/roleMiddleware.js";

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
