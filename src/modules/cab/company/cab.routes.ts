import { Router } from "express";
import { CabController } from "./cab.controller.js";
import { protect } from "../../../shared/middlewares/verifyToken.js";
import { authorize } from "../../../shared/middlewares/roleMiddleware.js";

const router = Router();
const cabController = new CabController();

//vendor routes...

router.post(
  "/vendor/cabs",
  protect,
  authorize("vendor"),
  cabController.createCabCompany,
);

export default router;
