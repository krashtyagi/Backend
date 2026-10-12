import { Router } from "express";
import { AdventureController } from "./adventure.controller.js";
import { protect, optionalProtect } from "../../../shared/middlewares/verifyToken.js";
import { authorize } from "../../../shared/middlewares/roleMiddleware.js";

const router = Router();
const adventureController = new AdventureController();

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

export default router;
