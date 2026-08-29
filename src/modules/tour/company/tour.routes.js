const express = require("express");
const router = express.Router();
const tourController = require("./tour.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

// Public routes
router.get("/", tourController.getTourCompanies);
router.get("/companies", tourController.getTourCompanies);
router.get("/grouped-by-city", tourController.getTourCompaniesGroupedByCity);
router.get("/companies/:id", tourController.getTourCompanyById);
router.get("/:id", tourController.getTourCompanyById);

// Vendor routes...
router.post(
  "/vendor/tours",
  protect,
  authorize("vendor"),
  tourController.createTourCompany,
);

module.exports = router;
