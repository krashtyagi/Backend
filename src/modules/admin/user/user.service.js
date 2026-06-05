const mongoose = require("mongoose");

const User = require("../../auth/auth.model");

// HOTEL BOOKINGS
const Booking = require("../../bookings/booking.model");

// GENERIC BOOKINGS
const GenericBooking = require("../../multiServiceBookings/booking.model");

exports.getAllUsers = async (query) => {
  try {
    const {
      page = 1,

      limit = 10,

      search,

      status,
    } = query;

    const skip = (page - 1) * limit;

    const matchStage = {
      role: "user",
    };

    // STATUS FILTER
    if (status === "active") {
      matchStage.isActive = true;
    }

    if (status === "blocked") {
      matchStage.isActive = false;
    }

    const pipeline = [
      {
        $match: matchStage,
      },

      // SEARCH
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

      // HOTEL BOOKINGS
      {
        $lookup: {
          from: "bookings",

          localField: "_id",

          foreignField: "userId",

          as: "hotelBookings",
        },
      },

      // GENERIC BOOKINGS
      {
        $lookup: {
          from: "genericbookings",

          localField: "_id",

          foreignField: "userId",

          as: "genericBookings",
        },
      },

      // TOTAL BOOKINGS
      {
        $addFields: {
          hotelBookingCount: {
            $size: "$hotelBookings",
          },

          genericBookingCount: {
            $size: "$genericBookings",
          },
        },
      },

      {
        $addFields: {
          totalBookings: {
            $add: ["$hotelBookingCount", "$genericBookingCount"],
          },
        },
      },

      {
        $project: {
          _id: 1,

          firstName: 1,

          lastName: 1,

          email: 1,

          phoneNumber: 1,

          avatar: 1,

          isActive: 1,

          createdAt: 1,

          totalBookings: 1,
        },
      },

      // SORTING
      // 1. MOST BOOKINGS
      // 2. LATEST USERS
      {
        $sort: {
          totalBookings: -1,

          createdAt: -1,
        },
      },

      {
        $facet: {
          data: [
            {
              $skip: skip,
            },

            {
              $limit: Number(limit),
            },
          ],

          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ];

    const result = await User.aggregate(pipeline);

    const users = result[0].data;

    const total = result[0].totalCount[0]?.count || 0;

    return {
      users,

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

exports.getUserBookings = async (userId, query) => {
  try {
    const {
      page = 1,

      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const hotelPipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },

      // HOTEL
      {
        $lookup: {
          from: "hotels",

          localField: "hotelId",

          foreignField: "_id",

          as: "hotel",
        },
      },

      {
        $unwind: {
          path: "$hotel",

          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,

          bookingReference: 1,

          serviceType: {
            $literal: "hotel",
          },

          name: {
            $ifNull: ["$hotel.name", "N/A"],
          },

          city: {
            $ifNull: ["$hotel.city", "N/A"],
          },

          image: {
            $arrayElemAt: ["$hotel.images.url", 0],
          },

          bookingDate: "$checkIn",

          checkIn: 1,

          checkOut: 1,

          totalAmount: 1,

          status: 1,

          paymentStatus: 1,

          createdAt: 1,
        },
      },
    ];

    const genericPipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },

      {
        $project: {
          _id: 1,

          bookingReference: 1,

          serviceType: 1,

          name: "$serviceSnapshot.title",

          city: {
            $ifNull: ["$meta.city", "N/A"],
          },

          image: {
            $ifNull: [
              {
                $arrayElemAt: ["$serviceSnapshot.extra.images", 0],
              },

              null,
            ],
          },

          bookingDate: 1,

          duration: 1,

          quantity: 1,

          totalAmount: "$pricing.totalAmount",

          status: 1,

          paymentStatus: 1,

          createdAt: 1,
        },
      },
    ];

    // EXECUTE BOTH
    const [hotelBookings, genericBookings] = await Promise.all([
      Booking.aggregate(hotelPipeline),

      GenericBooking.aggregate(genericPipeline),
    ]);

    // MERGE + SORT
    const allBookings = [...hotelBookings, ...genericBookings].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    // PAGINATION
    const paginatedBookings = allBookings.slice(
      skip,

      skip + Number(limit),
    );

    return {
      bookings: paginatedBookings,

      pagination: {
        page: Number(page),

        limit: Number(limit),

        total: allBookings.length,
      },
    };
  } catch (error) {
    throw error;
  }
};

exports.getBookingDetail = async (userId, bookingId) => {
  try {
    const hotelPipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(bookingId),

          userId: new mongoose.Types.ObjectId(userId),
        },
      },

      // HOTEL
      {
        $lookup: {
          from: "hotels",

          localField: "hotelId",

          foreignField: "_id",

          as: "hotel",
        },
      },

      {
        $unwind: {
          path: "$hotel",

          preserveNullAndEmptyArrays: true,
        },
      },

      // VENDOR
      {
        $lookup: {
          from: "vendors",

          localField: "hotel.vendorId",

          foreignField: "_id",

          as: "vendor",
        },
      },

      {
        $unwind: {
          path: "$vendor",

          preserveNullAndEmptyArrays: true,
        },
      },

      // PAYMENT
      {
        $lookup: {
          from: "payments",

          localField: "_id",

          foreignField: "bookingId",

          as: "payment",
        },
      },

      {
        $unwind: {
          path: "$payment",

          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          bookingType: {
            $literal: "hotel",
          },

          // BOOKING INFO
          bookingInfo: {
            bookingId: "$_id",

            bookingReference: "$bookingReference",

            status: "$status",

            paymentStatus: "$paymentStatus",

            checkIn: "$checkIn",

            checkOut: "$checkOut",

            nights: "$nights",

            createdAt: "$createdAt",

            guests: "$guests",

            primaryGuest: "$primaryGuest",

            additionalGuests: "$additionalGuests",

            specialRequest: "$specialRequest",

            roomNumber: "$roomNumber",

            cancellation: {
              cancelledAt: "$cancelledAt",

              cancellationReason: "$cancellationReason",
            },

            refund: {
              refundStatus: "$refundStatus",

              refundAmount: "$refundAmount",

              refundPercentage: "$refundPercentage",

              refundRequestedAt: "$refundRequestedAt",

              refundProcessedAt: "$refundProcessedAt",
            },
          },

          // SERVICE
          service: {
            type: "hotel",

            hotel: {
              _id: "$hotel._id",

              name: "$hotel.name",

              city: "$hotel.city",

              address: "$hotel.address",

              rating: "$hotel.rating",

              numReviews: "$hotel.numReviews",

              isActive: "$hotel.isActive",

              verificationStatus: "$hotel.verificationStatus",

              image: {
                $arrayElemAt: ["$hotel.images.url", 0],
              },
            },

            room: {
              roomTypeId: "$roomTypeId",

              pricePerNight: "$pricePerNight",
            },
          },

          // VENDOR
          vendor: {
            _id: "$vendor._id",

            businessName: "$vendor.businessName",

            businessEmail: "$vendor.businessEmail",

            businessPhone: "$vendor.businessPhone",

            city: "$vendor.city",

            status: "$vendor.status",

            isActive: "$vendor.isActive",
          },

          // PAYMENT
          payment: {
            _id: "$payment._id",

            razorpayOrderId: "$payment.razorpayOrderId",

            razorpayPaymentId: "$payment.razorpayPaymentId",

            amountPaid: "$payment.amountPaid",

            currency: "$payment.currency",

            paymentMethod: "$payment.paymentMethod",

            status: "$payment.status",

            isVerified: "$payment.isVerified",

            refund: {
              refundAmount: "$payment.refundAmount",

              refundStatus: "$payment.refundStatus",

              refundedAt: "$payment.refundedAt",
            },
          },

          // PRICING
          pricing: {
            pricePerNight: "$pricePerNight",

            nights: "$nights",

            roomsBooked: "$roomsBooked",

            taxAmount: "$taxAmount",

            cleaningFee: "$cleaningFee",

            discountAmount: "$discountAmount",

            totalAmount: "$totalAmount",
          },
        },
      },
    ];

    const genericPipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(bookingId),

          userId: new mongoose.Types.ObjectId(userId),
        },
      },

      // VENDOR
      {
        $lookup: {
          from: "vendors",

          localField: "vendorId",

          foreignField: "_id",

          as: "vendor",
        },
      },

      {
        $unwind: {
          path: "$vendor",

          preserveNullAndEmptyArrays: true,
        },
      },

      // PAYMENT
      {
        $lookup: {
          from: "payments",

          localField: "paymentId",

          foreignField: "_id",

          as: "payment",
        },
      },

      {
        $unwind: {
          path: "$payment",

          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          bookingType: {
            $literal: "generic",
          },

          // BOOKING INFO
          bookingInfo: {
            bookingId: "$_id",

            bookingReference: "$bookingReference",

            status: "$status",

            paymentStatus: "$paymentStatus",

            bookingDate: "$bookingDate",

            duration: "$duration",

            quantity: "$quantity",

            timeSlot: "$timeSlot",

            createdAt: "$createdAt",

            participants: "$participants",

            primaryCustomer: "$primaryCustomer",

            specialRequest: "$specialRequest",

            cancellation: {
              cancelledAt: "$cancelledAt",

              cancellationReason: "$cancellationReason",
            },

            refund: {
              refundStatus: "$refundStatus",

              refundAmount: "$refundAmount",
            },
          },

          // SERVICE
          service: {
            type: "$serviceType",

            serviceId: "$serviceId",

            title: "$serviceSnapshot.title",

            price: "$serviceSnapshot.price",

            extra: "$serviceSnapshot.extra",

            meta: "$meta",

            extraInfo: "$extraInfo",
          },

          // VENDOR
          vendor: {
            _id: "$vendor._id",

            businessName: "$vendor.businessName",

            businessEmail: "$vendor.businessEmail",

            businessPhone: "$vendor.businessPhone",

            city: "$vendor.city",

            status: "$vendor.status",

            isActive: "$vendor.isActive",
          },

          // PAYMENT
          payment: {
            _id: "$payment._id",

            razorpayOrderId: "$payment.razorpayOrderId",

            razorpayPaymentId: "$payment.razorpayPaymentId",

            amountPaid: "$payment.amountPaid",

            currency: "$payment.currency",

            paymentMethod: "$payment.paymentMethod",

            status: "$payment.status",

            isVerified: "$payment.isVerified",

            refund: {
              refundAmount: "$payment.refundAmount",

              refundStatus: "$payment.refundStatus",

              refundedAt: "$payment.refundedAt",
            },
          },

          // PRICING
          pricing: {
            baseAmount: "$pricing.baseAmount",

            taxAmount: "$pricing.taxAmount",

            taxPercentage: "$pricing.taxPercentage",

            discountAmount: "$pricing.discountAmount",

            totalAmount: "$pricing.totalAmount",
          },
        },
      },
    ];

    // EXECUTE BOTH
    const [hotelBooking, genericBooking] = await Promise.all([
      Booking.aggregate(hotelPipeline),

      GenericBooking.aggregate(genericPipeline),
    ]);

    // RETURN PRIORITY
    if (hotelBooking.length > 0) {
      return hotelBooking[0];
    }

    if (genericBooking.length > 0) {
      return genericBooking[0];
    }

    throw new Error("Booking not found");
  } catch (error) {
    throw error;
  }
};

exports.updateUserStatus = async (userId, body) => {
  try {
    const { isActive } = body;

    if (isActive === undefined || isActive === null) {
      throw new Error("isActive field is required");
    }

    if (typeof isActive !== "boolean") {
      throw new Error("isActive must be true or false");
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    const existingUser = await User.findOne({
      _id: userId,
      role: "user",
    }).select("_id");

    if (!existingUser) {
      throw new Error("User not found");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isActive,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("_id firstName lastName email isActive createdAt updatedAt");

    // Extra safety check
    if (!user) {
      throw new Error("User not found");
    }

    // Return success response
    const action = isActive ? "unblocked" : "blocked";
    const message = isActive
      ? "User unblocked successfully"
      : "User blocked successfully";

    return {
      success: true,
      message,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
        status: isActive ? "active" : "blocked",
        updatedAt: user.updatedAt,
      },
    };
  } catch (error) {
    console.error("updateUserStatus error:", error);

    if (error.message === "Invalid user ID format") {
      throw new Error("Invalid user ID format");
    }
    if (error.message === "User not found") {
      throw new Error("User not found");
    }
    throw error;
  }
};
