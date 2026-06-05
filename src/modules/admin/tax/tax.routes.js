const express = require("express");
const router = express.Router();

const controller = require("./tax.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

router.post(
  "/set-tax",
  protect,
  authorize("admin"),
  controller.setTax
);

router.get("/active", controller.getActiveTax);

module.exports = router;