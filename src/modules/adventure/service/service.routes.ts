import { Router } from "express";
import { ServiceController } from "./service.controller.js";
import { protect, optionalProtect } from "../../../shared/middlewares/verifyToken.js";
import { authorize } from "../../../shared/middlewares/roleMiddleware.js";

const router = Router();
const serviceController = new ServiceController();

router.get("/:id", optionalProtect, serviceController.getServiceDetails);

//vendor
router.post(
  "/vendor/services",
  protect,
  authorize("vendor"),
  serviceController.createService,
);

router.get(
  "/vendor/services",
  protect,
  authorize("vendor"),
  serviceController.getVendorServices,
);

router.get(
  "/vendor/services/:id",
  protect,
  authorize("vendor"),
  serviceController.getVendorServiceById,
);

router.put(
  "/vendor/services/:id",
  protect,
  authorize("vendor"),
  serviceController.updateService,
);

router.delete(
  "/vendor/services/:id",
  protect,
  authorize("vendor"),
  serviceController.deleteService,
);

export default router;
