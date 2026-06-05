const mongoose = require("mongoose");
const Booking = require("../../bookings/booking.model");
const GenericBooking = require("../../multiServiceBookings/booking.model");

exports.getBookingStats = async () => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // SINGLE QUERY - Hotel stats
    const [
      hotelTotal,
      hotelToday,
      hotelPending,
      hotelCancelled,
      genericTotal,
      genericToday,
      genericPending,
      genericCancelled,
    ] = await Promise.all([
      Booking.countDocuments({}),
      Booking.countDocuments({
        createdAt: { $gte: todayStart, $lte: todayEnd },
      }),
      Booking.countDocuments({ paymentStatus: "pending" }),
      Booking.countDocuments({ status: "cancelled" }),

      // GENERIC STATS
      GenericBooking.countDocuments({}),
      GenericBooking.countDocuments({
        createdAt: { $gte: todayStart, $lte: todayEnd },
      }),
      GenericBooking.countDocuments({ paymentStatus: "pending" }),
      GenericBooking.countDocuments({ status: "cancelled" }),
    ]);

    return {
      totalBookings: hotelTotal + genericTotal,
      todaysBookings: hotelToday + genericToday,
      pendingPayments: hotelPending + genericPending,
      cancellations: hotelCancelled + genericCancelled,
    };
  } catch (error) {
    console.error("getBookingStats error:", error);
    throw error;
  }
};

exports.getAllBookings = async (query) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      paymentStatus,
      serviceType,
      startDate,
      endDate,
    } = query;

    const skip = (page - 1) * Number(limit);
    const take = Number(limit);
    const now = new Date();

    let dateFilter = {};
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && isNaN(start.getTime())) {
        throw new Error("Invalid startDate format. Use ISO date (YYYY-MM-DD)");
      }
      if (end && isNaN(end.getTime())) {
        throw new Error("Invalid endDate format. Use ISO date (YYYY-MM-DD)");
      }

      // Set time boundaries
      if (start) {
        start.setHours(0, 0, 0, 0);
      }
      if (end) {
        end.setHours(23, 59, 59, 999);
      }

      dateFilter = {
        createdAt: {
          ...(start && { $gte: start }),
          ...(end && { $lte: end }),
        },
      };
    }

    const hotelMatch = { ...dateFilter };
    if (paymentStatus) hotelMatch.paymentStatus = paymentStatus;
    if (status === "cancelled") hotelMatch.status = "cancelled";

    const genericMatch = { ...dateFilter };
    if (paymentStatus) genericMatch.paymentStatus = paymentStatus;
    if (serviceType && serviceType !== "hotel")
      genericMatch.serviceType = serviceType;
    if (status === "cancelled") genericMatch.status = "cancelled";
    else if (status === "upcoming") genericMatch.status = "confirmed";
    else if (status === "completed") genericMatch.status = "completed";

    const [hotelCount, genericCount] = await Promise.all([
      Booking.countDocuments(hotelMatch),
      GenericBooking.countDocuments(genericMatch),
    ]);

    const totalCount = hotelCount + genericCount;

    if (totalCount === 0) {
      return {
        bookings: [],
        pagination: { page: Number(page), limit: take, total: 0 },
        filters: { startDate, endDate, status, paymentStatus, serviceType },
      };
    }

    let hotelPipeline = [{ $match: hotelMatch }, { $sort: { createdAt: -1 } }];

    // Date-based status filters for hotel
    if (status === "upcoming") {
      hotelPipeline.push({
        $match: { checkIn: { $gt: now }, status: { $ne: "cancelled" } },
      });
    } else if (status === "ongoing") {
      hotelPipeline.push({
        $match: {
          checkIn: { $lte: now },
          checkOut: { $gte: now },
          status: { $ne: "cancelled" },
        },
      });
    } else if (status === "completed") {
      hotelPipeline.push({
        $match: { checkOut: { $lt: now }, status: { $ne: "cancelled" } },
      });
    }

    // Search filter
    if (search) {
      hotelPipeline.push({
        $match: {
          $or: [
            { bookingReference: { $regex: search, $options: "i" } },
            { "user.firstName": { $regex: search, $options: "i" } },
            { "user.lastName": { $regex: search, $options: "i" } },
            { "hotel.name": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    // Lookups
    hotelPipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "hotels",
          localField: "hotelId",
          foreignField: "_id",
          as: "hotel",
        },
      },
      { $unwind: { path: "$hotel", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
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
          serviceType: { $literal: "hotel" },
          serviceName: { $ifNull: ["$hotel.name", "N/A"] },
          city: { $ifNull: ["$hotel.city", "N/A"] },
          bookingDate: "$checkIn",
          createdAt: 1,
          totalAmount: 1,
          paymentStatus: 1,
          status: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "cancelled"] }, then: "cancelled" },
                { case: { $gt: ["$checkIn", now] }, then: "upcoming" },
                {
                  case: {
                    $and: [
                      { $lte: ["$checkIn", now] },
                      { $gte: ["$checkOut", now] },
                    ],
                  },
                  then: "ongoing",
                },
                { case: { $lt: ["$checkOut", now] }, then: "completed" },
              ],
              default: "pending",
            },
          },
        },
      },
    );

    let genericPipeline = [
      { $match: genericMatch },
      { $sort: { createdAt: -1 } },
    ];

    if (search) {
      genericPipeline.push({
        $match: {
          $or: [
            { bookingReference: { $regex: search, $options: "i" } },
            { "serviceSnapshot.title": { $regex: search, $options: "i" } },
            { "user.firstName": { $regex: search, $options: "i" } },
            { "user.lastName": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    genericPipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
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
          serviceType: 1,
          serviceName: "$serviceSnapshot.title",
          city: { $ifNull: ["$meta.city", "N/A"] },
          bookingDate: "$bookingDate",
          createdAt: 1,
          totalAmount: "$pricing.totalAmount",
          paymentStatus: 1,
          status: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "cancelled"] }, then: "cancelled" },
                { case: { $eq: ["$status", "confirmed"] }, then: "upcoming" },
                { case: { $eq: ["$status", "completed"] }, then: "completed" },
              ],
              default: "pending",
            },
          },
        },
      },
    );

    const extraBuffer = take;
    const hotelFetchLimit = Math.min(hotelCount, skip + take + extraBuffer);
    const genericFetchLimit = Math.min(genericCount, skip + take + extraBuffer);

    const hotelPipelineWithLimit = [...hotelPipeline];
    const genericPipelineWithLimit = [...genericPipeline];

    if (hotelFetchLimit > 0) {
      hotelPipelineWithLimit.push({ $limit: hotelFetchLimit });
    }
    if (genericFetchLimit > 0) {
      genericPipelineWithLimit.push({ $limit: genericFetchLimit });
    }

    const [hotelBookings, genericBookings] = await Promise.all([
      hotelFetchLimit > 0
        ? Booking.aggregate(hotelPipelineWithLimit)
        : Promise.resolve([]),
      genericFetchLimit > 0
        ? GenericBooking.aggregate(genericPipelineWithLimit)
        : Promise.resolve([]),
    ]);

    const mergedBookings = [];
    let i = 0,
      j = 0;

    while (
      i < hotelBookings.length &&
      j < genericBookings.length &&
      mergedBookings.length < skip + take
    ) {
      if (
        new Date(hotelBookings[i].createdAt) >=
        new Date(genericBookings[j].createdAt)
      ) {
        mergedBookings.push(hotelBookings[i]);
        i++;
      } else {
        mergedBookings.push(genericBookings[j]);
        j++;
      }
    }

    while (i < hotelBookings.length && mergedBookings.length < skip + take) {
      mergedBookings.push(hotelBookings[i]);
      i++;
    }

    while (j < genericBookings.length && mergedBookings.length < skip + take) {
      mergedBookings.push(genericBookings[j]);
      j++;
    }

    // Apply pagination
    const paginatedBookings = mergedBookings.slice(skip, skip + take);

    return {
      bookings: paginatedBookings,
      pagination: {
        page: Number(page),
        limit: take,
        total: totalCount,
        hotelCount,
        genericCount,
      },
      filters: {
        startDate: startDate || null,
        endDate: endDate || null,
        status: status || null,
        paymentStatus: paymentStatus || null,
        serviceType: serviceType || null,
      },
    };
  } catch (error) {
    console.error("getAllBookings error:", error);
    throw error;
  }
};

exports.getBookingDetail = async (bookingId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new Error("Invalid booking ID");
    }

    const objectId = new mongoose.Types.ObjectId(bookingId);

    // First try HOTEL booking
    const hotelBooking = await Booking.aggregate([
      { $match: { _id: objectId } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "hotels",
          localField: "hotelId",
          foreignField: "_id",
          as: "hotel",
        },
      },
      { $unwind: { path: "$hotel", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "vendors",
          localField: "hotel.vendorId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "bookingId",
          as: "payment",
        },
      },
      { $unwind: { path: "$payment", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          bookingType: { $literal: "hotel" },
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
          user: {
            _id: "$user._id",
            name: {
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
            email: "$user.email",
            phoneNumber: "$user.phoneNumber",
          },
          service: {
            type: "hotel",
            hotel: {
              _id: "$hotel._id",
              name: "$hotel.name",
              city: "$hotel.city",
              address: "$hotel.address",
              rating: "$hotel.rating",
              numReviews: "$hotel.numReviews",
              verificationStatus: "$hotel.verificationStatus",
              image: { $arrayElemAt: ["$hotel.images.url", 0] },
            },
            room: {
              roomTypeId: "$roomTypeId",
              pricePerNight: "$pricePerNight",
            },
          },
          vendor: {
            _id: "$vendor._id",
            businessName: "$vendor.businessName",
            businessEmail: "$vendor.businessEmail",
            businessPhone: "$vendor.businessPhone",
            city: "$vendor.city",
            status: "$vendor.status",
            isActive: "$vendor.isActive",
          },
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
    ]);

    if (hotelBooking.length > 0) {
      return hotelBooking[0];
    }

    // If not hotel, try GENERIC booking
    const genericBooking = await GenericBooking.aggregate([
      { $match: { _id: objectId } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "vendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "payments",
          localField: "paymentId",
          foreignField: "_id",
          as: "payment",
        },
      },
      { $unwind: { path: "$payment", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          bookingType: { $literal: "generic" },
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
          user: {
            _id: "$user._id",
            name: {
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
            email: "$user.email",
            phoneNumber: "$user.phoneNumber",
          },
          service: {
            type: "$serviceType",
            serviceId: "$serviceId",
            title: "$serviceSnapshot.title",
            price: "$serviceSnapshot.price",
            extra: "$serviceSnapshot.extra",
            meta: "$meta",
            extraInfo: "$extraInfo",
          },
          vendor: {
            _id: "$vendor._id",
            businessName: "$vendor.businessName",
            businessEmail: "$vendor.businessEmail",
            businessPhone: "$vendor.businessPhone",
            city: "$vendor.city",
            status: "$vendor.status",
            isActive: "$vendor.isActive",
          },
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
          pricing: {
            baseAmount: "$pricing.baseAmount",
            taxAmount: "$pricing.taxAmount",
            taxPercentage: "$pricing.taxPercentage",
            discountAmount: "$pricing.discountAmount",
            totalAmount: "$pricing.totalAmount",
          },
        },
      },
    ]);

    if (genericBooking.length > 0) {
      return genericBooking[0];
    }

    throw new Error("Booking not found");
  } catch (error) {
    console.error("getBookingDetail error:", error);
    throw error;
  }
};
