const supportService = require("./support.service");
const logger = require("../../../shared/utils/logger");

// Get all tickets
exports.getAllTickets = async (req, res, next) => {
  try {
    const result = await supportService.getAllTickets(req.query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getAllTickets", error);
    next(error);
  }
};

// Get ticket detail (admin)
exports.getTicketDetail = async (req, res, next) => {
  try {
    const ticket = await supportService.getTicketDetail(req.params.ticketId);

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    logger.error("Controller Error: getTicketDetail (admin)", error);
    next(error);
  }
};

// Admin reply
exports.replyToTicket = async (req, res, next) => {
  try {
    const ticket = await supportService.replyToTicket(
      req.params.ticketId,
      req.body.message,
    );

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      data: ticket,
    });
  } catch (error) {
    logger.error("Controller Error: replyToTicket (admin)", error);
    next(error);
  }
};

// Close ticket
exports.closeTicket = async (req, res, next) => {
  try {
    const ticket = await supportService.closeTicket(req.params.ticketId);

    res.status(200).json({
      success: true,
      message: "Ticket closed successfully",
      data: ticket,
    });
  } catch (error) {
    logger.error("Controller Error: closeTicket", error);
    next(error);
  }
};

// Get support stats
exports.getSupportStats = async (req, res, next) => {
  try {
    const stats = await supportService.getSupportStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error("Controller Error: getSupportStats", error);
    next(error);
  }
};
