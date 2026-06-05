const express = require("express");
const router = express.Router();
const favoriteController = require("./favorite.controller");
const { protect } = require("../../shared/middlewares/verifyToken");

router.use(protect);

// router.post("/toggle/:itemId", favoriteController.toggleFavorite);

router.post("/toggle/:serviceType/:itemId", favoriteController.toggleFavorite);

router.get("/me", favoriteController.getMyFavorites);

router.get("/summary", favoriteController.getFavoritesSummary);
router.get("/my-trip", favoriteController.getMyTripFavorites);

module.exports = router;
