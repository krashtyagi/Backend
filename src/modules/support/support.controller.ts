import { Request, Response, NextFunction } from "express";
import supportService from "./support.service";
import logger from "src/shared/utils/logger";

export class SupportController {
  // Create ticket
  public async createTicket(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const ticket = await supportService.createTicket(
        req.body,
        (req as any).user._id,
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
  }

  // Get my tickets
  public async getMyTickets(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await supportService.getMyTickets(
        (req as any).user._id,
        req.query,
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Controller Error: getMyTickets", error);
      next(error);
    }
  }

  // Get ticket detail
  public async getTicketDetail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const ticket = await supportService.getTicketDetail(
        req.params.ticketId,
        (req as any).user._id,
      );

      res.status(200).json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      logger.error("Controller Error: getTicketDetail", error);
      next(error);
    }
  }

  // Reply to ticket
  public async replyToTicket(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const ticket = await supportService.replyToTicket(
        req.params.ticketId,
        (req as any).user._id,
        req.body.message,
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
  }
}
