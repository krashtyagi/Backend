const express = require("express");
const router = express.Router();
const paymentController = require("./payment.controller");
const { protect } = require("../../shared/middlewares/verifyToken");

router.post("/verify", protect, paymentController.verifyPayment);

module.exports = router;
