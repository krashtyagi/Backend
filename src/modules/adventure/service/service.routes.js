const express = require("express");
const router = express.Router();
const serviceController = require("./service.controller");
const {
  protect,
  optionalProtect,
} = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

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

module.exports = router;
