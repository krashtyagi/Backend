import { Router } from "express";
import { TaxController } from "./tax.controller.js";
import { protect } from "../../../shared/middlewares/verifyToken.js";
import { authorize } from "../../../shared/middlewares/roleMiddleware.js";

const router = Router();
const taxController = new TaxController();

router.post("/set-tax", protect, authorize("admin"), taxController.setTax);

router.get("/active", taxController.getActiveTax);

export default router;
