import mongoose from "mongoose";
import Support from "./support.model.js";

export const createTicket = async (data: any, userId: any) => {
  try {
    const { name, email, phoneNumber, subject, description, bookingReference } =
      data;

    if (!name || !email || !subject || !description) {
      throw new Error("Required fields are missing");
    }

    const ticket = await Support.create({
      userId,
      name,
      email,
      phoneNumber,
      subject,
      description,
      bookingReference,

      // first message
      messages: [
        {
          sender: "user",
          message: description,
        },
      ],
    });

    return ticket;
  } catch (error) {
    throw error;
  }
};

export const getMyTickets = async (userId: any, query: any = {}) => {
  try {
    const { page = 1, limit = 10, status } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {
      userId,
    };

    if (status) {
      filter.status = status;
    }

    const tickets = await Support.find(filter)
      .select("subject status createdAt lastMessageAt")
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Support.countDocuments(filter);

    return {
      tickets,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getTicketDetail = async (ticketId: any, userId: any) => {
  try {
    const ticket = await Support.findOne({
      _id: ticketId,
      userId,
    }).lean();

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    return {
      _id: ticket._id,
      subject: ticket.subject,
      status: ticket.status,
      bookingReference: ticket.bookingReference,
      createdAt: ticket.createdAt,

      // full chat
      messages: ticket.messages?.map((msg: any) => ({
        sender: msg.sender,
        message: msg.message,
        createdAt: msg.createdAt,
      })) || [],
    };
  } catch (error) {
    throw error;
  }
};

export const replyToTicket = async (ticketId: any, userId: any, message: string) => {
  try {
    if (!message) {
      throw new Error("Message is required");
    }

    const ticket = await Support.findOne({
      _id: ticketId,
      userId,
    });

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // optional: closed ticket
    if (ticket.status === "closed") {
      throw new Error("Ticket is closed");
    }

    // push new message
    ticket.messages.push({
      sender: "user",
      message,
    });

    // update last activity
    ticket.lastMessageAt = new Date();

    // auto status update
    if (ticket.status === "resolved") {
      ticket.status = "in_progress";
    }

    await ticket.save();

    return ticket;
  } catch (error) {
    throw error;
  }
};

export class SupportService {
  async createTicket(data: any, userId: any) {
    return createTicket(data, userId);
  }

  async getMyTickets(userId: any, query: any = {}) {
    return getMyTickets(userId, query);
  }

  async getTicketDetail(ticketId: any, userId: any) {
    return getTicketDetail(ticketId, userId);
  }

  async replyToTicket(ticketId: any, userId: any, message: string) {
    return replyToTicket(ticketId, userId, message);
  }
}

export const supportService = new SupportService();

export default supportService;

