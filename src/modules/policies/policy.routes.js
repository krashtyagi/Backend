const express = require("express");
const router = express.Router();
const controller = require("./policy.controller");
const { protect } = require("../../shared/middlewares/verifyToken");
const { authorize } = require("../../shared/middlewares/roleMiddleware");

// Public
router.get("/hotel/:hotelId", controller.getPolicy);

// Vendor
router.use(protect);
router.post("/", authorize("vendor"), controller.setPolicy);

module.exports = router;
