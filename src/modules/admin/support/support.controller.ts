import { Request, Response, NextFunction } from "express";
import supportService from "./support.service";
import logger from "src/shared/utils/logger";

export class SupportController {
  // Get all tickets
  public async getAllTickets(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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
  }

  // Get ticket detail (admin)
  public async getTicketDetail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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
  }

  // Admin reply
  public async replyToTicket(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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
  }

  // Close ticket
  public async closeTicket(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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
  }

  // Get support stats
  public async getSupportStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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
  }
}
