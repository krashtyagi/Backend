import { Router } from "express";
import { BikeController } from "./bike.controller";
import { protect } from "src/shared/middlewares/verifyToken";
import { authorize } from "src/shared/middlewares/roleMiddleware";

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
