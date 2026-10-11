import { Router } from "express";
import { FavoriteController } from "./favorite.controller";
import { protect } from "../../shared/middlewares/verifyToken";

const router = Router();
const favoriteController = new FavoriteController();

router.use(protect);

router.post("/toggle/:serviceType/:itemId", favoriteController.toggleFavorite);

router.get("/me", favoriteController.getMyFavorites);

router.get("/summary", favoriteController.getFavoritesSummary);
router.get("/my-trip", favoriteController.getMyTripFavorites);

export default router;
