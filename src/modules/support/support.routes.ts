import { Router } from "express";
import { SupportController } from "./support.controller.js";
import { protect } from "../../shared/middlewares/verifyToken.js";

const router = Router();
const supportController = new SupportController();

//Get my tickets
router.get("/", protect, supportController.getMyTickets);

//Create ticket
router.post("/", protect, supportController.createTicket);

//Get ticket detail
router.get("/:ticketId", protect, supportController.getTicketDetail);

//Reply to ticket
router.post("/:ticketId/reply", protect, supportController.replyToTicket);

export default router;
