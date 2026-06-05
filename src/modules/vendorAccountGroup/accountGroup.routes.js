const express = require("express");
const router = express.Router();

const vendorAccountController = require("./accountGroup.controller");

const { authorize } = require("../../shared/middlewares/roleMiddleware");
const { protect } = require("../../shared/middlewares/verifyToken");


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

module.exports = router;
