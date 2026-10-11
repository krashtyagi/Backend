import { Router } from "express";
import { TourServiceController } from "./tourService.controller";
import { protect, optionalProtect } from "../../../shared/middlewares/verifyToken";
import { authorize } from "../../../shared/middlewares/roleMiddleware";

const router = Router();
const tourServiceController = new TourServiceController();

//user side

router.get("/", optionalProtect, tourServiceController.getTours);
router.get(
  "/:id",
  optionalProtect,
  tourServiceController.getTourServiceDetails,
);

router.get(
  "/company/:id",
  optionalProtect,
  tourServiceController.getCompanyDetails,
);

//vendor routes...
router.post(
  "/vendor/tour-services",
  protect,
  authorize("vendor"),
  tourServiceController.createTourService,
);

router.get(
  "/vendor/tour-services",
  protect,
  authorize("vendor"),
  tourServiceController.getVendorTourServices,
);

router.get(
  "/vendor/tour-services/:id",
  protect,
  authorize("vendor"),
  tourServiceController.getVendorTourServiceById,
);

router.put(
  "/vendor/tour-services/:id",
  protect,
  authorize("vendor"),
  tourServiceController.updateVendorTourService,
);

router.delete(
  "/vendor/tour-services/:id",
  protect,
  authorize("vendor"),
  tourServiceController.deleteVendorTourService,
);

export default router;
