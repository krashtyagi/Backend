const express = require("express");
const router = express.Router();
const cabController = require("./cab.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

//vendor routes...

router.post(
  "/vendor/cabs",
  protect,
  authorize("vendor"),
  cabController.createCabCompany,
);

module.exports = router;
