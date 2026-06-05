const express = require("express");
const router = express.Router();

const bankController = require("./bank.controller");

const { protect } = require("../../shared/middlewares/verifyToken");
const { authorize } = require("../../shared/middlewares/roleMiddleware");

//Create vendor bank details
router.post("/", protect, authorize("vendor"), bankController.createBankDetails);

module.exports = router;