const mongoose = require("mongoose");

const Payment = require("../../payments/payment.model");

const GenericPayment = require("../../multiServiceBookings/payment.model");

exports.getAllPayments = async (query) => {
  try {
    const {
      page = 1,

      limit = 10,

      search,

      status,

      paymentMethod,

      serviceType,
    } = query;

    const skip = (page - 1) * limit;

    const matchStage = {};

    if (status) {
      matchStage.status = status;
    }

    if (paymentMethod) {
      matchStage.paymentMethod = paymentMethod;
    }

    const hotelPipeline = [
      {
        $match: matchStage,
      },

      // BOOKING
      {
        $lookup: {
          from: "bookings",

          localField: "bookingId",

          foreignField: "_id",

          as: "booking",
        },
      },

      {
        $unwind: "$booking",
      },

      // USER
      {
        $lookup: {
          from: "users",

          localField: "userId",

          foreignField: "_id",

          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      // HOTEL
      {
        $lookup: {
          from: "hotels",

          localField: "booking.hotelId",

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

      // SEARCH
      ...(search
        ? [
            {
              $match: {
                $or: [
                  {
                    razorpayPaymentId: {
                      $regex: search,

                      $options: "i",
                    },
                  },

                  {
                    "booking.bookingReference": {
                      $regex: search,

                      $options: "i",
                    },
                  },

                  {
                    "user.firstName": {
                      $regex: search,

                      $options: "i",
                    },
                  },

                  {
                    "user.lastName": {
                      $regex: search,

                      $options: "i",
                    },
                  },

                  {
                    "hotel.name": {
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
        $project: {
          _id: 1,

          paymentId: "$_id",

          bookingId: "$booking._id",

          bookingReference: "$booking.bookingReference",

          userName: {
            $trim: {
              input: {
                $concat: [
                  {
                    $ifNull: ["$user.firstName", ""],
                  },

                  " ",

                  {
                    $ifNull: ["$user.lastName", ""],
                  },
                ],
              },
            },
          },

          serviceType: {
            $literal: "hotel",
          },

          serviceName: {
            $ifNull: ["$hotel.name", "N/A"],
          },

          vendorName: {
            $ifNull: ["$vendor.businessName", "N/A"],
          },

          amountPaid: "$amountPaid",

          paymentMethod: 1,

          paymentStatus: "$status",

          refundStatus: "$refundStatus",

          createdAt: 1,
        },
      },
    ];

    const genericPipeline = [
      {
        $match: matchStage,
      },

      // BOOKING
      {
        $lookup: {
          from: "genericbookings",

          localField: "bookingId",

          foreignField: "_id",

          as: "booking",
        },
      },

      {
        $unwind: "$booking",
      },

      // USER
      {
        $lookup: {
          from: "users",

          localField: "userId",

          foreignField: "_id",

          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      // VENDOR
      {
        $lookup: {
          from: "vendors",

          localField: "booking.vendorId",

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

      // SEARCH
      ...(search
        ? [
            {
              $match: {
                $or: [
                  {
                    gatewayPaymentId: {
                      $regex: search,

                      $options: "i",
                    },
                  },

                  {
                    "booking.bookingReference": {
                      $regex: search,

                      $options: "i",
                    },
                  },

                  {
                    "user.firstName": {
                      $regex: search,

                      $options: "i",
                    },
                  },

                  {
                    "user.lastName": {
                      $regex: search,

                      $options: "i",
                    },
                  },

                  {
                    "booking.serviceSnapshot.title": {
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
        $project: {
          _id: 1,

          paymentId: "$_id",

          bookingId: "$booking._id",

          bookingReference: "$booking.bookingReference",

          userName: {
            $trim: {
              input: {
                $concat: [
                  {
                    $ifNull: ["$user.firstName", ""],
                  },

                  " ",

                  {
                    $ifNull: ["$user.lastName", ""],
                  },
                ],
              },
            },
          },

          serviceType: "$booking.serviceType",

          serviceName: {
            $ifNull: ["$booking.serviceSnapshot.title", "N/A"],
          },

          vendorName: {
            $ifNull: ["$vendor.businessName", "N/A"],
          },

          amountPaid: "$amount",

          paymentMethod: 1,

          paymentStatus: "$status",

          refundStatus: "$refundStatus",

          createdAt: 1,
        },
      },
    ];

    const [hotelPayments, genericPayments] = await Promise.all([
      serviceType !== "hotel" ? [] : Payment.aggregate(hotelPipeline),

      serviceType === "hotel" ? [] : GenericPayment.aggregate(genericPipeline),
    ]);

    let allPayments = [...hotelPayments, ...genericPayments];

    // SERVICE FILTER
    if (serviceType && serviceType !== "hotel") {
      allPayments = allPayments.filter((p) => p.serviceType === serviceType);
    }

    // SORT
    allPayments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // PAGINATION
    const paginated = allPayments.slice(
      skip,

      skip + Number(limit),
    );

    return {
      payments: paginated,

      pagination: {
        page: Number(page),

        limit: Number(limit),

        total: allPayments.length,
      },
    };
  } catch (error) {
    throw error;
  }
};

exports.getPaymentDetail = async (paymentId) => {
  try {
    const hotelPipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(paymentId),
        },
      },

      // BOOKING
      {
        $lookup: {
          from: "bookings",

          localField: "bookingId",

          foreignField: "_id",

          as: "booking",
        },
      },

      {
        $unwind: "$booking",
      },

      // USER
      {
        $lookup: {
          from: "users",

          localField: "userId",

          foreignField: "_id",

          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      // HOTEL
      {
        $lookup: {
          from: "hotels",

          localField: "booking.hotelId",

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

      {
        $project: {
          paymentType: {
            $literal: "hotel",
          },

          paymentInfo: {
            paymentId: "$_id",

            razorpayOrderId: "$razorpayOrderId",

            razorpayPaymentId: "$razorpayPaymentId",

            amountPaid: "$amountPaid",

            currency: "$currency",

            paymentMethod: "$paymentMethod",

            status: "$status",

            isVerified: "$isVerified",

            createdAt: "$createdAt",
          },

          bookingInfo: {
            bookingId: "$booking._id",

            bookingReference: "$booking.bookingReference",

            status: "$booking.status",

            checkIn: "$booking.checkIn",

            checkOut: "$booking.checkOut",

            guests: "$booking.guests",

            totalAmount: "$booking.totalAmount",
          },

          user: {
            _id: "$user._id",

            name: {
              $trim: {
                input: {
                  $concat: [
                    {
                      $ifNull: ["$user.firstName", ""],
                    },

                    " ",

                    {
                      $ifNull: ["$user.lastName", ""],
                    },
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

              image: {
                $arrayElemAt: ["$hotel.images.url", 0],
              },
            },
          },

          vendor: {
            _id: "$vendor._id",

            businessName: "$vendor.businessName",

            businessEmail: "$vendor.businessEmail",

            businessPhone: "$vendor.businessPhone",

            city: "$vendor.city",

            status: "$vendor.status",
          },

          refund: {
            refundStatus: "$booking.refundStatus",

            refundAmount: "$booking.refundAmount",

            refundPercentage: "$booking.refundPercentage",

            cancellationReason: "$booking.cancellationReason",

            refundRequestedAt: "$booking.refundRequestedAt",

            refundedAt: "$refundedAt",
          },
        },
      },
    ];

    const genericPipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(paymentId),
        },
      },

      // BOOKING
      {
        $lookup: {
          from: "genericbookings",

          localField: "bookingId",

          foreignField: "_id",

          as: "booking",
        },
      },

      {
        $unwind: "$booking",
      },

      // USER
      {
        $lookup: {
          from: "users",

          localField: "userId",

          foreignField: "_id",

          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      // VENDOR
      {
        $lookup: {
          from: "vendors",

          localField: "booking.vendorId",

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

      {
        $project: {
          paymentType: {
            $literal: "generic",
          },

          paymentInfo: {
            paymentId: "$_id",

            gatewayOrderId: "$gatewayOrderId",

            gatewayPaymentId: "$gatewayPaymentId",

            amountPaid: "$amount",

            currency: "$currency",

            paymentMethod: "$paymentMethod",

            status: "$status",

            isVerified: "$isVerified",

            createdAt: "$createdAt",
          },

          bookingInfo: {
            bookingId: "$booking._id",

            bookingReference: "$booking.bookingReference",

            status: "$booking.status",

            bookingDate: "$booking.bookingDate",

            duration: "$booking.duration",

            quantity: "$booking.quantity",

            totalAmount: "$booking.pricing.totalAmount",
          },

          user: {
            _id: "$user._id",

            name: {
              $trim: {
                input: {
                  $concat: [
                    {
                      $ifNull: ["$user.firstName", ""],
                    },

                    " ",

                    {
                      $ifNull: ["$user.lastName", ""],
                    },
                  ],
                },
              },
            },

            email: "$user.email",

            phoneNumber: "$user.phoneNumber",
          },

          service: {
            type: "$booking.serviceType",

            serviceId: "$booking.serviceId",

            title: "$booking.serviceSnapshot.title",

            extra: "$booking.serviceSnapshot.extra",
          },

          vendor: {
            _id: "$vendor._id",

            businessName: "$vendor.businessName",

            businessEmail: "$vendor.businessEmail",

            businessPhone: "$vendor.businessPhone",

            city: "$vendor.city",

            status: "$vendor.status",
          },

          refund: {
            refundStatus: "$refundStatus",

            refundAmount: "$refundAmount",

            refundedAt: "$refundedAt",
          },
        },
      },
    ];

    const [hotelPayment, genericPayment] = await Promise.all([
      Payment.aggregate(hotelPipeline),

      GenericPayment.aggregate(genericPipeline),
    ]);

    if (hotelPayment.length > 0) {
      return hotelPayment[0];
    }

    if (genericPayment.length > 0) {
      return genericPayment[0];
    }

    throw new Error("Payment not found");
  } catch (error) {
    throw error;
  }
};

exports.getPaymentStats = async () => {
  try {
    const todayStart = new Date();

    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();

    todayEnd.setHours(23, 59, 59, 999);

    const hotelPipeline = [
      {
        $facet: {
          totalRevenue: [
            {
              $match: {
                status: "captured",
              },
            },

            {
              $group: {
                _id: null,

                total: {
                  $sum: "$amountPaid",
                },
              },
            },
          ],

          todaysRevenue: [
            {
              $match: {
                status: "captured",

                createdAt: {
                  $gte: todayStart,

                  $lte: todayEnd,
                },
              },
            },

            {
              $group: {
                _id: null,

                total: {
                  $sum: "$amountPaid",
                },
              },
            },
          ],

          pendingPayments: [
            {
              $match: {
                status: "created",
              },
            },

            {
              $count: "count",
            },
          ],

          failedPayments: [
            {
              $match: {
                status: "failed",
              },
            },

            {
              $count: "count",
            },
          ],

          refundAmount: [
            {
              $match: {
                refundStatus: {
                  $in: ["processed", "partially_refunded"],
                },
              },
            },

            {
              $group: {
                _id: null,

                total: {
                  $sum: "$refundAmount",
                },
              },
            },
          ],
        },
      },
    ];

    const genericPipeline = [
      {
        $facet: {
          totalRevenue: [
            {
              $match: {
                status: "captured",
              },
            },

            {
              $group: {
                _id: null,

                total: {
                  $sum: "$amount",
                },
              },
            },
          ],

          todaysRevenue: [
            {
              $match: {
                status: "captured",

                createdAt: {
                  $gte: todayStart,

                  $lte: todayEnd,
                },
              },
            },

            {
              $group: {
                _id: null,

                total: {
                  $sum: "$amount",
                },
              },
            },
          ],

          pendingPayments: [
            {
              $match: {
                status: "created",
              },
            },

            {
              $count: "count",
            },
          ],

          failedPayments: [
            {
              $match: {
                status: "failed",
              },
            },

            {
              $count: "count",
            },
          ],

          refundAmount: [
            {
              $match: {
                refundStatus: {
                  $in: ["processed"],
                },
              },
            },

            {
              $group: {
                _id: null,

                total: {
                  $sum: "$refundAmount",
                },
              },
            },
          ],
        },
      },
    ];

    const [hotelStats, genericStats] = await Promise.all([
      Payment.aggregate(hotelPipeline),

      GenericPayment.aggregate(genericPipeline),
    ]);

    const hotel = hotelStats[0];

    const generic = genericStats[0];

    return {
      totalRevenue: Math.floor(
        (hotel.totalRevenue[0]?.total || 0) +
          (generic.totalRevenue[0]?.total || 0),
      ),

      todaysRevenue: Math.floor(
        (hotel.todaysRevenue[0]?.total || 0) +
          (generic.todaysRevenue[0]?.total || 0),
      ),

      pendingPayments:
        (hotel.pendingPayments[0]?.count || 0) +
        (generic.pendingPayments[0]?.count || 0),

      failedPayments:
        (hotel.failedPayments[0]?.count || 0) +
        (generic.failedPayments[0]?.count || 0),

      refundAmount: Math.floor(
        (hotel.refundAmount[0]?.total || 0) +
          (generic.refundAmount[0]?.total || 0),
      ),
    };
  } catch (error) {
    throw error;
  }
};

exports.getPaymentAnalytics = async (query) => {
  try {
    const { range = "7d" } = query;

    const now = new Date();

    let startDate = new Date();

    if (range === "7d") {
      startDate.setDate(now.getDate() - 7);
    } else if (range === "30d") {
      startDate.setDate(now.getDate() - 30);
    } else if (range === "12m") {
      startDate.setMonth(now.getMonth() - 12);
    }

    const hotelPipeline = [
      {
        $match: {
          createdAt: {
            $gte: startDate,

            $lte: now,
          },
        },
      },

      {
        $facet: {
          // REVENUE TREND
          revenueTrend: [
            {
              $match: {
                status: "captured",
              },
            },

            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",

                    date: "$createdAt",
                  },
                },

                total: {
                  $sum: "$amountPaid",
                },
              },
            },

            {
              $sort: {
                _id: 1,
              },
            },
          ],

          // PAYMENT METHODS
          paymentMethods: [
            {
              $group: {
                _id: "$paymentMethod",

                count: {
                  $sum: 1,
                },

                total: {
                  $sum: "$amountPaid",
                },
              },
            },
          ],

          // STATUS DISTRIBUTION
          statusDistribution: [
            {
              $group: {
                _id: "$status",

                count: {
                  $sum: 1,
                },
              },
            },
          ],
        },
      },
    ];

    const genericPipeline = [
      {
        $match: {
          createdAt: {
            $gte: startDate,

            $lte: now,
          },
        },
      },

      {
        $facet: {
          revenueTrend: [
            {
              $match: {
                status: "captured",
              },
            },

            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",

                    date: "$createdAt",
                  },
                },

                total: {
                  $sum: "$amount",
                },
              },
            },

            {
              $sort: {
                _id: 1,
              },
            },
          ],

          paymentMethods: [
            {
              $group: {
                _id: "$paymentMethod",

                count: {
                  $sum: 1,
                },

                total: {
                  $sum: "$amount",
                },
              },
            },
          ],

          statusDistribution: [
            {
              $group: {
                _id: "$status",

                count: {
                  $sum: 1,
                },
              },
            },
          ],
        },
      },
    ];

    const [hotelAnalytics, genericAnalytics] = await Promise.all([
      Payment.aggregate(hotelPipeline),

      GenericPayment.aggregate(genericPipeline),
    ]);

    const hotel = hotelAnalytics[0];

    const generic = genericAnalytics[0];

    const revenueMap = {};

    [...hotel.revenueTrend, ...generic.revenueTrend].forEach((item) => {
      if (!revenueMap[item._id]) {
        revenueMap[item._id] = 0;
      }

      revenueMap[item._id] += item.total;
    });

    const revenueTrend = Object.entries(revenueMap).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    const methodMap = {};

    [...hotel.paymentMethods, ...generic.paymentMethods].forEach((item) => {
      if (!methodMap[item._id]) {
        methodMap[item._id] = {
          method: item._id,

          count: 0,

          total: 0,
        };
      }

      methodMap[item._id].count += item.count;

      methodMap[item._id].total += item.total;
      methodMap[item._id].total = Math.floor(methodMap[item._id].total);
    });

    const paymentMethods = Object.values(methodMap);

    const statusMap = {};

    [...hotel.statusDistribution, ...generic.statusDistribution].forEach(
      (item) => {
        if (!statusMap[item._id]) {
          statusMap[item._id] = 0;
        }

        statusMap[item._id] += item.count;
      },
    );

    const statusDistribution = Object.entries(statusMap).map(
      ([status, count]) => ({
        status,
        count,
      }),
    );

    return {
      revenueTrend,

      paymentMethods,

      statusDistribution,
    };
  } catch (error) {
    throw error;
  }
};

exports.getRefundRequests = async (query) => {
  try {
    let {
      page = 1,

      limit = 10,

      search,
    } = query;

    page = Number(page);

    limit = Number(limit);

    const skip = (page - 1) * limit;

    const hotelPipeline = [
      {
        $match: {
          status: "cancellation_requested",

          refundStatus: "pending",
        },
      },

      // USER
      {
        $lookup: {
          from: "users",

          localField: "userId",

          foreignField: "_id",

          as: "user",
        },
      },

      {
        $unwind: {
          path: "$user",

          preserveNullAndEmptyArrays: true,
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

          let: {
            bookingId: "$_id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$bookingId", "$$bookingId"],
                },
              },
            },

            {
              $sort: {
                createdAt: -1,
              },
            },

            {
              $limit: 1,
            },
          ],

          as: "payment",
        },
      },

      {
        $unwind: {
          path: "$payment",

          preserveNullAndEmptyArrays: true,
        },
      },

      // SEARCH
      ...(search
        ? [
            {
              $match: {
                $or: [
                  {
                    bookingReference: {
                      $regex: search,

                      $options: "i",
                    },
                  },

                  {
                    "user.firstName": {
                      $regex: search,

                      $options: "i",
                    },
                  },

                  {
                    "user.lastName": {
                      $regex: search,

                      $options: "i",
                    },
                  },

                  {
                    "user.email": {
                      $regex: search,

                      $options: "i",
                    },
                  },

                  {
                    "hotel.name": {
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
        $project: {
          _id: 0,

          refundType: {
            $literal: "hotel",
          },

          bookingId: "$_id",

          bookingReference: 1,

          serviceType: {
            $literal: "hotel",
          },

          userName: {
            $trim: {
              input: {
                $concat: [
                  {
                    $ifNull: ["$user.firstName", ""],
                  },

                  " ",

                  {
                    $ifNull: ["$user.lastName", ""],
                  },
                ],
              },
            },
          },

          userEmail: {
            $ifNull: ["$user.email", ""],
          },

          serviceName: {
            $ifNull: ["$hotel.name", "N/A"],
          },

          vendorName: {
            $ifNull: ["$vendor.businessName", "N/A"],
          },

          totalAmount: 1,

          refundAmount: 1,

          refundPercentage: 1,

          cancellationReason: 1,

          paymentId: "$payment._id",

          paymentMethod: "$payment.paymentMethod",

          createdAt: 1,
        },
      },
    ];

    const genericPipeline = [
      {
        $match: {
          status: "cancelled",

          refundStatus: "pending",
        },
      },

      // USER
      {
        $lookup: {
          from: "users",

          localField: "userId",

          foreignField: "_id",

          as: "user",
        },
      },

      {
        $unwind: {
          path: "$user",

          preserveNullAndEmptyArrays: true,
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
          from: "genericpayments",

          let: {
            bookingId: "$_id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$bookingId", "$$bookingId"],
                },
              },
            },

            {
              $sort: {
                createdAt: -1,
              },
            },

            {
              $limit: 1,
            },
          ],

          as: "payment",
        },
      },

      {
        $unwind: {
          path: "$payment",

          preserveNullAndEmptyArrays: true,
        },
      },

      // SEARCH
      ...(search
        ? [
            {
              $match: {
                $or: [
                  {
                    bookingReference: {
                      $regex: search,

                      $options: "i",
                    },
                  },

                  {
                    "user.firstName": {
                      $regex: search,

                      $options: "i",
                    },
                  },

                  {
                    "user.lastName": {
                      $regex: search,

                      $options: "i",
                    },
                  },

                  {
                    "user.email": {
                      $regex: search,

                      $options: "i",
                    },
                  },

                  {
                    "serviceSnapshot.title": {
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
        $project: {
          _id: 0,

          refundType: {
            $literal: "generic",
          },

          bookingId: "$_id",

          bookingReference: 1,

          serviceType: 1,

          userName: {
            $trim: {
              input: {
                $concat: [
                  {
                    $ifNull: ["$user.firstName", ""],
                  },

                  " ",

                  {
                    $ifNull: ["$user.lastName", ""],
                  },
                ],
              },
            },
          },

          userEmail: {
            $ifNull: ["$user.email", ""],
          },

          serviceName: {
            $ifNull: ["$serviceSnapshot.title", "N/A"],
          },

          vendorName: {
            $ifNull: ["$vendor.businessName", "N/A"],
          },

          totalAmount: "$pricing.totalAmount",

          refundAmount: 1,

          cancellationReason: 1,

          paymentId: "$payment._id",

          paymentMethod: "$payment.paymentMethod",

          createdAt: 1,
        },
      },
    ];

    const [hotelRefunds, genericRefunds] = await Promise.all([
      Booking.aggregate(hotelPipeline),

      GenericBooking.aggregate(genericPipeline),
    ]);

    const allRefunds = [...hotelRefunds, ...genericRefunds].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    // PAGINATION
    const paginatedRefunds = allRefunds.slice(
      skip,

      skip + limit,
    );

    return {
      refunds: paginatedRefunds,

      pagination: {
        page,

        limit,

        total: allRefunds.length,

        totalPages: Math.ceil(allRefunds.length / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

exports.handleRefund = async (paymentId, action) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    if (!["approve", "reject"].includes(action)) {
      throw new Error("Invalid action");
    }

    let payment = await Payment.findById(paymentId).session(session);

    let booking = null;

    let isGeneric = false;

    if (!payment) {
      payment = await GenericPayment.findById(paymentId).session(session);

      if (!payment) {
        throw new Error("Payment not found");
      }

      isGeneric = true;
    }

    if (isGeneric) {
      booking = await GenericBooking.findById(payment.bookingId).session(
        session,
      );
    } else {
      booking = await Booking.findById(payment.bookingId).session(session);
    }

    if (!booking) {
      throw new Error("Booking not found");
    }

    const validHotelRefund =
      booking.status === "cancellation_requested" &&
      booking.refundStatus === "pending";

    const validGenericRefund =
      booking.status === "cancelled" && booking.refundStatus === "pending";

    if (!validHotelRefund && !validGenericRefund) {
      throw new Error("No pending refund request");
    }

    const now = new Date();

    let refundPercentage = 0;

    let refundAmount = 0;

    if (!isGeneric) {
      const daysBeforeCheckIn = Math.ceil(
        (new Date(booking.checkIn) - now) / (1000 * 60 * 60 * 24),
      );

      const isWithin24Hours =
        now - new Date(booking.createdAt) <= 24 * 60 * 60 * 1000;

      if (isWithin24Hours) {
        refundPercentage = 100;
      } else if (daysBeforeCheckIn >= 30) {
        refundPercentage = 100;
      } else if (daysBeforeCheckIn >= 15) {
        refundPercentage = 50;
      } else {
        refundPercentage = 0;
      }

      refundAmount = Math.round((booking.totalAmount * refundPercentage) / 100);
    }

    if (isGeneric) {
      refundPercentage = 80;

      refundAmount = Math.round(
        (booking.pricing?.totalAmount * refundPercentage) / 100,
      );
    }

    if (action === "approve") {
      if (payment.refundStatus === "processed") {
        throw new Error("Refund already processed");
      }

      if (!isGeneric) {
        if (!payment.razorpayPaymentId || payment.status !== "captured") {
          throw new Error("Payment not eligible for refund");
        }
      }

      if (isGeneric) {
        if (!payment.gatewayPaymentId || payment.status !== "captured") {
          throw new Error("Payment not eligible for refund");
        }
      }

      let refund = null;

      if (refundAmount > 0) {
        const paymentGatewayId = isGeneric
          ? payment.gatewayPaymentId
          : payment.razorpayPaymentId;

        refund = await razorpay.payments.refund(paymentGatewayId, {
          amount: refundAmount * 100,
        });
      }

      if (!isGeneric) {
        for (let i = 0; i < booking.nights; i++) {
          const currentDate = new Date(
            booking.checkIn.getTime() + i * 86400000,
          );

          currentDate.setHours(0, 0, 0, 0);

          await Availability.findOneAndUpdate(
            {
              roomTypeId: booking.roomTypeId,

              date: currentDate,
            },

            {
              $inc: {
                bookedRooms: -booking.roomsBooked,
              },
            },

            {
              session,
            },
          );
        }
      }

      booking.refundAmount = refundAmount;

      booking.refundStatus = refundAmount > 0 ? "processed" : "approved";

      booking.paymentStatus = refundAmount > 0 ? "refunded" : "paid";

      booking.refundProcessedAt = now;

      booking.cancelledAt = now;

      // HOTEL STATUS
      if (!isGeneric) {
        booking.status = "cancelled";

        booking.refundPercentage = refundPercentage;
      }

      // GENERIC STATUS
      if (isGeneric) {
        booking.status = "cancelled";
      }

      await booking.save({
        session,
      });

      payment.refundAmount = refundAmount;

      payment.refundStatus = refundAmount > 0 ? "processed" : "none";

      // HOTEL
      if (!isGeneric) {
        if (refund) {
          payment.razorpayRefundId = refund.id;
        }

        if (refundAmount === booking.totalAmount) {
          payment.status = "refunded";
        } else if (refundAmount > 0) {
          payment.status = "partially_refunded";
        }
      }

      // GENERIC
      if (isGeneric) {
        if (refundAmount === booking.pricing?.totalAmount) {
          payment.status = "refunded";
        }
      }

      payment.refundedAt = refundAmount > 0 ? now : null;

      await payment.save({
        session,
      });

      await session.commitTransaction();

      session.endSession();

      return {
        message: "Refund approved successfully",

        refundAmount,

        refundPercentage,
      };
    }

    if (action === "reject") {
      // HOTEL
      if (!isGeneric) {
        booking.status = "confirmed";
      }

      // GENERIC
      if (isGeneric) {
        booking.status = "confirmed";
      }

      booking.refundStatus = "failed";

      await booking.save({
        session,
      });

      await session.commitTransaction();

      session.endSession();

      return {
        message: "Refund request rejected",
      };
    }
  } catch (error) {
    await session.abortTransaction();

    session.endSession();

    throw error;
  }
};
