import { Router } from "express";
import { UserController } from "./user.controller";
import { protect } from "../../shared/middlewares/verifyToken";

const router = Router();
const userController = new UserController();

router.use(protect);

router.get("/me", userController.getMe);
router.patch("/update-me", userController.updateMe);

router.post(
  "/delete-account-request",
  protect,
  userController.deleteAccountRequest,
);

export default router;
