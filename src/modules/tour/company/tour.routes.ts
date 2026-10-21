import { Router } from "express";
import { TourController } from "./tour.controller.js";
import { protect, optionalProtect } from "../../../shared/middlewares/verifyToken.js";
import { authorize } from "../../../shared/middlewares/roleMiddleware.js";

const router = Router();
const tourController = new TourController();

// Public routes
router.get("/", optionalProtect, tourController.getTourCompanies);
router.get("/companies", optionalProtect, tourController.getTourCompanies);
router.get("/grouped-by-city", tourController.getTourCompaniesGroupedByCity);
router.get("/companies/:id", optionalProtect, tourController.getTourCompanyById);
router.get("/ranked", optionalProtect, tourController.getRankedTourCompanies);
router.get("/:id", optionalProtect, tourController.getTourCompanyById);

// Vendor routes...
router.post(
  "/vendor/tours",
  protect,
  authorize("vendor"),
  tourController.createTourCompany,
);

export default router;
