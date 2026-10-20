import { Router } from "express";
import { PaymentController } from "./payment.controller.js";
import { optionalProtect } from "../../shared/middlewares/verifyToken.js";

const router = Router();
const paymentController = new PaymentController();

router.post("/verify", optionalProtect, paymentController.verifyPayment);

export default router;
