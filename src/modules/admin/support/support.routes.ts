import { Router } from "express";
import { SupportController } from "./support.controller";
import { protect } from "src/shared/middlewares/verifyToken";
import { authorize } from "src/shared/middlewares/roleMiddleware";

const router = Router();
const supportController = new SupportController();

// Support stats
router.get(
  "/stats",
  protect,
  authorize("admin"),
  supportController.getSupportStats,
);

//Get all tickets
router.get("/", protect, authorize("admin"), supportController.getAllTickets);

// Get ticket detail
router.get(
  "/:ticketId",
  protect,
  authorize("admin"),
  supportController.getTicketDetail,
);

// Admin reply to ticket
router.post(
  "/:ticketId/reply",
  protect,
  authorize("admin"),
  supportController.replyToTicket,
);

// Close ticket
router.patch(
  "/:ticketId/close",
  protect,
  authorize("admin"),
  supportController.closeTicket,
);

export default router;
