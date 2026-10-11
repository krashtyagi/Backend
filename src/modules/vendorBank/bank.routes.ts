import { Router } from "express";
import { BankController } from "./bank.controller";
import { protect } from "../../shared/middlewares/verifyToken";
import { authorize } from "../../shared/middlewares/roleMiddleware";

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
