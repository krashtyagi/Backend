const express = require("express");
const router = express.Router();

const supportController = require("./support.controller");
const { protect } = require("../../shared/middlewares/verifyToken");

//Get my tickets
router.get("/", protect, supportController.getMyTickets);

//Create ticket
router.post("/", protect, supportController.createTicket);

//Get ticket detail
router.get("/:ticketId", protect, supportController.getTicketDetail);

//Reply to ticket
router.post("/:ticketId/reply", protect, supportController.replyToTicket);

module.exports = router;