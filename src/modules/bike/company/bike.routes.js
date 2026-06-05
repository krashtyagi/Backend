const express = require("express");
const router = express.Router();
const bikeController = require("./bike.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

//vendor routes...

router.post(
  "/vendor/bikes",
  protect,
  authorize("vendor"),
  bikeController.createBikeCompany,
);

module.exports = router;
