const express = require("express");
const router = express.Router();
const tourController = require("./tour.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

//vendor routes...

router.post(
  "/vendor/tours",
  protect,
  authorize("vendor"),
  tourController.createTourCompany,
);

module.exports = router;
