const express = require("express");
const router = express.Router();
const adventureController = require("./adventure.controller");
const { protect, optionalProtect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

router.get("/search", optionalProtect, adventureController.searchAdventures);

router.get("/", optionalProtect, adventureController.getAdventures);

router.get("/:id", optionalProtect, adventureController.getAdventureDetails);

//vendor routes...

router.post(
  "/vendor/adventures",
  protect,
  authorize("vendor"),
  adventureController.createAdventure,
);
router.get(
  "/vendor/adventures",
  protect,
  authorize("vendor"),
  adventureController.getVendorAdventures,
);

router.get(
  "/vendor/adventures/:id",
  protect,
  authorize("vendor"),
  adventureController.getVendorAdventureDetails,
);

router.put(
  "/vendor/adventures/:id",
  protect,
  authorize("vendor"),
  adventureController.updateAdventure,
);

router.delete(
  "/vendor/adventures/:id",
  protect,
  authorize("vendor"),
  adventureController.deleteAdventure,
);

module.exports = router;
