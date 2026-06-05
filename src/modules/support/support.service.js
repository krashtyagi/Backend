const mongoose = require("mongoose");
const Support = require("./support.model");

exports.createTicket = async (data, userId) => {
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

      //first message
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

exports.getMyTickets = async (userId, query) => {
  try {
    const { page = 1, limit = 10, status } = query;

    const skip = (page - 1) * limit;

    const filter = {
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

exports.getTicketDetail = async (ticketId, userId) => {
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

      //full chat
      messages: ticket.messages.map((msg) => ({
        sender: msg.sender,
        message: msg.message,
        createdAt: msg.createdAt,
      })),
    };
  } catch (error) {
    throw error;
  }
};

exports.replyToTicket = async (ticketId, userId, message) => {
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

    //optional: closed ticket
    if (ticket.status === "closed") {
      throw new Error("Ticket is closed");
    }

    //push new message
    ticket.messages.push({
      sender: "user",
      message,
    });

    //update last activity
    ticket.lastMessageAt = new Date();

    //auto status update
    if (ticket.status === "resolved") {
      ticket.status = "in_progress";
    }

    await ticket.save();

    return ticket;
  } catch (error) {
    throw error;
  }
};
