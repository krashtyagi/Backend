import { Router } from "express";
import { PolicyController } from "./policy.controller.js";
import { protect } from "../../shared/middlewares/verifyToken.js";
import { authorize } from "../../shared/middlewares/roleMiddleware.js";

const router = Router();
const controller = new PolicyController();

// Public
router.get("/hotel/:hotelId", controller.getPolicy);

// Vendor
router.use(protect);
router.post("/", authorize("vendor"), controller.setPolicy);

export default router;
