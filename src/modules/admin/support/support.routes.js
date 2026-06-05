const express = require("express");
const router = express.Router();

const supportController = require("./support.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

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

module.exports = router;
