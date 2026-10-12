import { Router } from "express";
import { CabServiceController } from "./cabService.controller.js";
import { protect, optionalProtect } from "../../../shared/middlewares/verifyToken.js";
import { authorize } from "../../../shared/middlewares/roleMiddleware.js";

const router = Router();
const cabServiceController = new CabServiceController();

//user side...

router.get("/", optionalProtect, cabServiceController.getCabs);
router.get("/:id", optionalProtect, cabServiceController.getCabServiceDetails);

router.get(
  "/company/:id",
  optionalProtect,
  cabServiceController.getCabCompanyDetails,
);

//vendor routes...

router.post(
  "/vendor/cab-services",
  protect,
  authorize("vendor"),
  cabServiceController.createCabService,
);

router.get(
  "/vendor/cab-services",
  protect,
  authorize("vendor"),
  cabServiceController.getVendorCabServices,
);

router.get(
  "/vendor/cab-services/:id",
  protect,
  authorize("vendor"),
  cabServiceController.getVendorCabServiceById,
);

router.put(
  "/vendor/cab-services/:id",
  protect,
  authorize("vendor"),
  cabServiceController.updateVendorCabService,
);

router.delete(
  "/vendor/cab-services/:id",
  protect,
  authorize("vendor"),
  cabServiceController.deleteVendorCabService,
);

export default router;
