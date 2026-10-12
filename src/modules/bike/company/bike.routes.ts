import { Router } from "express";
import { BikeController } from "./bike.controller.js";
import { protect } from "../../../shared/middlewares/verifyToken.js";
import { authorize } from "../../../shared/middlewares/roleMiddleware.js";

const router = Router();
const bikeController = new BikeController();

//vendor routes...

router.post(
  "/vendor/bikes",
  protect,
  authorize("vendor"),
  bikeController.createBikeCompany,
);

export default router;
