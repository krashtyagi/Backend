import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { protect } from "../../shared/middlewares/verifyToken";

const router = Router();
const paymentController = new PaymentController();

router.post("/verify", protect, paymentController.verifyPayment);

export default router;
