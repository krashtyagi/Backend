import { Router } from "express";
import { BankController } from "./bank.controller.js";
import { protect } from "../../shared/middlewares/verifyToken.js";
import { authorize } from "../../shared/middlewares/roleMiddleware.js";

const router = Router();
const bankController = new BankController();

//Create vendor bank details
router.post(
  "/",
  protect,
  authorize("vendor"),
  bankController.createBankDetails,
);

export default router;
