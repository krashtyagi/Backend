import { Router } from "express";
import { VendorAccountGroupController } from "./accountGroup.controller";
import { authorize } from "../../shared/middlewares/roleMiddleware";
import { protect } from "../../shared/middlewares/verifyToken";

const router = Router();
const vendorAccountController = new VendorAccountGroupController();

// CONNECT ACCOUNT
router.post(
  "/connect-account",
  protect,
  authorize("vendor"),
  vendorAccountController.connectVendorAccounts,
);

// GET CONNECTED ACCOUNTS
router.get(
  "/connected-accounts",
  protect,
  authorize("vendor"),
  vendorAccountController.getConnectedAccounts,
);

// SWITCH ACCOUNT
router.post(
  "/switch-account",
  protect,
  authorize("vendor"),
  vendorAccountController.switchVendorAccount,
);

export default router;
