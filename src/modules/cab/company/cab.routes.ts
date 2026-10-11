import { Router } from "express";
import { CabController } from "./cab.controller";
import { protect } from "src/shared/middlewares/verifyToken";
import { authorize } from "src/shared/middlewares/roleMiddleware";

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
