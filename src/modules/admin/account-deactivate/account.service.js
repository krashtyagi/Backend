const mongoose = require("mongoose");
const User = require("../../auth/auth.model");
const Booking = require("../../bookings/booking.model");
const GenericBooking = require("../../multiServiceBookings/booking.model");
const logger = require("../../../shared/utils/logger");

const {
  sendAccountDeletionApprovedEmail,
  sendAccountDeletionApprovedWhatsApp,
  sendAccountDeletionRejectedEmail,
  sendAccountDeletionRejectedWhatsApp,
} = require("../../../shared/utils/sendEmail");

exports.getDeleteRequests = async (query) => {
  try {
    const { page = 1, limit = 10, search } = query;

    const skip = (page - 1) * limit;

    const matchStage = {
      role: "user",
      "deleteRequest.status": "pending",
    };

    const pipeline = [
      {
        $match: matchStage,
      },

      ...(search
        ? [
            {
              $match: {
                $or: [
                  {
                    firstName: {
                      $regex: search,
                      $options: "i",
                    },
                  },
                  {
                    lastName: {
                      $regex: search,
                      $options: "i",
                    },
                  },
                  {
                    email: {
                      $regex: search,
                      $options: "i",
                    },
                  },
                  {
                    phoneNumber: {
                      $regex: search,
                      $options: "i",
                    },
                  },
                ],
              },
            },
          ]
        : []),

      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "userId",
          as: "hotelBookings",
        },
      },

      {
        $lookup: {
          from: "genericbookings",
          localField: "_id",
          foreignField: "userId",
          as: "genericBookings",
        },
      },

      {
        $addFields: {
          totalBookings: {
            $add: [{ $size: "$hotelBookings" }, { $size: "$genericBookings" }],
          },
        },
      },

      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          phoneNumber: 1,
          avatar: 1,
          totalBookings: 1,
          deleteRequest: 1,
        },
      },

      {
        $sort: {
          "deleteRequest.requestedAt": -1,
        },
      },

      {
        $facet: {
          data: [{ $skip: skip }, { $limit: Number(limit) }],

          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ];

    const result = await User.aggregate(pipeline);

    return {
      requests: result[0].data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result[0].totalCount[0]?.count || 0,
      },
    };
  } catch (error) {
    logger.error("Service Error: getDeleteRequests", error);

    throw error;
  }
};

exports.approveDeleteRequest = async (userId) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    const user = await User.findOne({
      _id: userId,
      role: "user",
      "deleteRequest.status": "pending",
    }).session(session);

    if (!user) {
      throw new Error("Pending account deletion request not found");
    }

    const email = user.email;
    const phone = user.phoneNumber;
    const firstName = user.firstName;

    // Remove user reference from hotel bookings
    await Booking.updateMany(
      {
        userId: user._id,
      },
      {
        $set: {
          userId: null,
        },
      },
      {
        session,
      },
    );

    // Remove user reference from generic bookings
    await GenericBooking.updateMany(
      {
        userId: user._id,
      },
      {
        $set: {
          userId: null,
        },
      },
      {
        session,
      },
    );

    // Permanently delete user
    await User.deleteOne(
      {
        _id: user._id,
      },
      {
        session,
      },
    );

    await session.commitTransaction();

    // Send notifications after successful commit
    Promise.allSettled([
      sendAccountDeletionApprovedEmail(email, firstName),
      sendAccountDeletionApprovedWhatsApp(phone, firstName),
    ]).catch((err) => {
      logger.error(
        "Failed to send account deletion approval notifications",
        err,
      );
    });

    return {
      success: true,
      message: "User account deleted successfully",
    };
  } catch (error) {
    await session.abortTransaction();

    logger.error("Service Error: approveDeleteRequest", error);

    throw error;
  } finally {
    session.endSession();
  }
};

exports.rejectDeleteRequest = async (userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    const user = await User.findOne({
      _id: userId,
      role: "user",
      "deleteRequest.status": "pending",
    });

    if (!user) {
      throw new Error("Pending account deletion request not found");
    }

    user.deleteRequest = {
      status: "none",
      requestedAt: null,
      reason: "",
    };

    await user.save();

    Promise.allSettled([
      sendAccountDeletionRejectedEmail(user.email, user.firstName),
      sendAccountDeletionRejectedWhatsApp(user.phoneNumber, user.firstName),
    ]).catch((err) => {
      logger.error(
        "Failed to send account deletion rejection notifications",
        err,
      );
    });

    return {
      success: true,
      message: "Account deletion request rejected successfully",
    };
  } catch (error) {
    logger.error("Service Error: rejectDeleteRequest", error);

    throw error;
  }
};
