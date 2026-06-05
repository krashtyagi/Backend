const supportService = require("./support.service");
const logger = require("../../shared/utils/logger");

// Create ticket
exports.createTicket = async (req, res, next) => {
  try {
    const ticket = await supportService.createTicket(
      req.body,
      req.user._id
    );

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: ticket,
    });
  } catch (error) {
    logger.error("Controller Error: createTicket", error);
    next(error);
  }
};

// Get my tickets
exports.getMyTickets = async (req, res, next) => {
  try {
    const result = await supportService.getMyTickets(
      req.user._id,
      req.query
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getMyTickets", error);
    next(error);
  }
};

// Get ticket detail
exports.getTicketDetail = async (req, res, next) => {
  try {
    const ticket = await supportService.getTicketDetail(
      req.params.ticketId,
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    logger.error("Controller Error: getTicketDetail", error);
    next(error);
  }
};

// Reply to ticket
exports.replyToTicket = async (req, res, next) => {
  try {
    const ticket = await supportService.replyToTicket(
      req.params.ticketId,
      req.user._id,
      req.body.message
    );

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      data: ticket,
    });
  } catch (error) {
    logger.error("Controller Error: replyToTicket", error);
    next(error);
  }
};