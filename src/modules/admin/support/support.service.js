const mongoose = require("mongoose");
const Support = require("../../support/support.model");

exports.getAllTickets = async (query) => {
  try {
    const { page = 1, limit = 10, status, search, sort = "-createdAt" } = query;

    const skip = (page - 1) * limit;

    const matchStage = {};

    //filter by status
    if (status) {
      matchStage.status = status;
    }

    const pipeline = [
      {
        $match: matchStage,
      },

      //USER JOIN
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      //SEARCH
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { subject: { $regex: search, $options: "i" } },
                  { email: { $regex: search, $options: "i" } },
                  { "user.firstName": { $regex: search, $options: "i" } },
                ],
              },
            },
          ]
        : []),

      {
        $project: {
          _id: 1,
          subject: 1,
          status: 1,
          bookingReference: 1,

          userName: {
            $trim: {
              input: {
                $concat: [
                  { $ifNull: ["$user.firstName", ""] },
                  " ",
                  { $ifNull: ["$user.lastName", ""] },
                ],
              },
            },
          },

          email: 1,
          phoneNumber: 1,

          lastMessageAt: 1,
          createdAt: 1,
        },
      },

      {
        $sort: { createdAt: -1 },
      },

      {
        $facet: {
          data: [{ $skip: skip }, { $limit: Number(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await Support.aggregate(pipeline);

    const tickets = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;

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

exports.getTicketDetail = async (ticketId) => {
  try {
    const ticket = await Support.findById(ticketId)
      .populate("userId", "firstName lastName email phoneNumber")
      .lean();

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    return {
      _id: ticket._id,
      subject: ticket.subject,
      status: ticket.status,
      bookingReference: ticket.bookingReference,
      createdAt: ticket.createdAt,

      //user info
      user: {
        _id: ticket.userId?._id,
        name: `${ticket.userId?.firstName || ""} ${
          ticket.userId?.lastName || ""
        }`.trim(),
        email: ticket.email,
        phoneNumber: ticket.phoneNumber,
      },

      // full chat
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

exports.replyToTicket = async (ticketId, message) => {
  try {
    if (!message) {
      throw new Error("Message is required");
    }

    const ticket = await Support.findById(ticketId);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    //closed ticket
    if (ticket.status === "closed") {
      throw new Error("Ticket is closed");
    }

    //push admin message
    ticket.messages.push({
      sender: "admin",
      message,
    });

    //update last activity
    ticket.lastMessageAt = new Date();

    // auto status update
    if (ticket.status === "open") {
      ticket.status = "in_progress";
    }

    await ticket.save();

    return ticket;
  } catch (error) {
    throw error;
  }
};

exports.closeTicket = async (ticketId) => {
  try {
    const ticket = await Support.findById(ticketId);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    //already closed
    if (ticket.status === "closed") {
      throw new Error("Ticket already closed");
    }

    //update status
    ticket.status = "closed";
    ticket.closedAt = new Date();

    await ticket.save();

    return ticket;
  } catch (error) {
    throw error;
  }
};

exports.getSupportStats = async () => {
  try {
    const stats = await Support.aggregate([
      {
        $group: {
          _id: null,

          totalTickets: { $sum: 1 },

          activeTickets: {
            $sum: {
              $cond: [{ $in: ["$status", ["open", "in_progress"]] }, 1, 0],
            },
          },

          resolvedTickets: {
            $sum: {
              $cond: [{ $eq: ["$status", "resolved"] }, 1, 0],
            },
          },

          closedTickets: {
            $sum: {
              $cond: [{ $eq: ["$status", "closed"] }, 1, 0],
            },
          },
        },
      },
    ]);

    return (
      stats[0] || {
        totalTickets: 0,
        activeTickets: 0,
        resolvedTickets: 0,
        closedTickets: 0,
      }
    );
  } catch (error) {
    throw error;
  }
};
