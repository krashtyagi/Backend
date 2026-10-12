import { Router } from "express";
import { TourController } from "./tour.controller.js";
import { protect } from "../../../shared/middlewares/verifyToken.js";
import { authorize } from "../../../shared/middlewares/roleMiddleware.js";

const router = Router();
const tourController = new TourController();

// Public routes
router.get("/", tourController.getTourCompanies);
router.get("/companies", tourController.getTourCompanies);
router.get("/grouped-by-city", tourController.getTourCompaniesGroupedByCity);
router.get("/companies/:id", tourController.getTourCompanyById);
router.get("/ranked", tourController.getRankedTourCompanies);
router.get("/:id", tourController.getTourCompanyById);

// Vendor routes...
router.post(
  "/vendor/tours",
  protect,
  authorize("vendor"),
  tourController.createTourCompany,
);

export default router;
