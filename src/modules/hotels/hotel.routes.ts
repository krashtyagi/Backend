import { Router } from "express";
import { HotelController } from "./hotel.controller";
import {
  protect,
  optionalProtect,
} from "../../shared/middlewares/verifyToken";
import { authorize } from "../../shared/middlewares/roleMiddleware";

const router = Router();
const hotelController = new HotelController();

// Public routes
router.get("/", optionalProtect, hotelController.getHotels);
router.get("/home", optionalProtect, hotelController.getHomeHotels);

router.get("/suggestions", hotelController.getSuggestions);
router.get("/search", optionalProtect, hotelController.searchHotels);

router.get("/nearby", hotelController.getNearbyHotels);
router.get("/ranked", hotelController.getRankedHotels);
router.get("/:id", optionalProtect, hotelController.getHotelDetails);
router.get("/:id/availability", hotelController.getHotelAvailability);

export default router;
