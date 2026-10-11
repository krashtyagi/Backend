import { Router } from "express";
import { TaxController } from "./tax.controller";
import { protect } from "src/shared/middlewares/verifyToken";
import { authorize } from "src/shared/middlewares/roleMiddleware";

const router = Router();
const taxController = new TaxController();

router.post("/set-tax", protect, authorize("admin"), taxController.setTax);

router.get("/active", taxController.getActiveTax);

export default router;
