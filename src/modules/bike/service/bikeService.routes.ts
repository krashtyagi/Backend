import { Router } from "express";
import { BikeServiceController } from "./bikeService.controller";
import { protect, optionalProtect } from "src/shared/middlewares/verifyToken";
import { authorize } from "src/shared/middlewares/roleMiddleware";

const router = Router();
const bikeServiceController = new BikeServiceController();

//user side

router.get("/", optionalProtect, bikeServiceController.getBikes);
router.get(
  "/:id",
  optionalProtect,
  bikeServiceController.getBikeServiceDetails,
);

router.get(
  "/company/:id",
  optionalProtect,
  bikeServiceController.getBikeCompanyDetails,
);

//vendor routes...
router.post(
  "/vendor/bike-services",
  protect,
  authorize("vendor"),
  bikeServiceController.createBikeService,
);

router.get(
  "/vendor/bike-services",
  protect,
  authorize("vendor"),
  bikeServiceController.getVendorBikeServices,
);

router.get(
  "/vendor/bike-services/:id",
  protect,
  authorize("vendor"),
  bikeServiceController.getVendorBikeServiceById,
);

router.put(
  "/vendor/bike-services/:id",
  protect,
  authorize("vendor"),
  bikeServiceController.updateVendorBikeService,
);

router.delete(
  "/vendor/bike-services/:id",
  protect,
  authorize("vendor"),
  bikeServiceController.deleteVendorBikeService,
);

export default router;
