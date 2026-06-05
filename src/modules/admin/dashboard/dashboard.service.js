const User = require("../../auth/auth.model");

const Hotel = require("../../hotels/hotel.model");

const CabCompany = require("../../cab/company/cab.model");

const BikeCompany = require("../../bike/company/bike.model");

const TourCompany = require("../../tour/company/tour.model");

const Adventure = require("../../adventure/category/adventure.model");

// HOTEL BOOKINGS
const Booking = require("../../bookings/booking.model");

// GENERIC BOOKINGS
const GenericBooking = require("../../multiServiceBookings/booking.model");

exports.getDashboard = async ({
  bookingRange = 7,

  revenueRange = 6,
}) => {
  try {
    // TOTAL USERS
    const totalUsersPromise = User.countDocuments({
      role: "user",
    });

    // TOTAL PROPERTIES
    const totalPropertiesPromise = Promise.all([
      Hotel.countDocuments(),

      CabCompany.countDocuments(),

      BikeCompany.countDocuments(),

      TourCompany.countDocuments(),

      Adventure.countDocuments(),
    ]);

    // TOTAL BOOKINGS
    const totalHotelBookingsPromise = Booking.countDocuments();

    const totalGenericBookingsPromise = GenericBooking.countDocuments();

    const [
      totalUsers,

      totalPropertiesRaw,

      totalHotelBookings,

      totalGenericBookings,
    ] = await Promise.all([
      totalUsersPromise,

      totalPropertiesPromise,

      totalHotelBookingsPromise,

      totalGenericBookingsPromise,
    ]);

    const totalProperties = totalPropertiesRaw.reduce(
      (acc, curr) => acc + curr,
      0,
    );

    const totalBookings = totalHotelBookings + totalGenericBookings;

    // TODAY BOOKINGS
    const todayStart = new Date();

    todayStart.setHours(0, 0, 0, 0);

    const [todayHotelBookings, todayGenericBookings] = await Promise.all([
      Booking.countDocuments({
        createdAt: {
          $gte: todayStart,
        },
      }),

      GenericBooking.countDocuments({
        createdAt: {
          $gte: todayStart,
        },
      }),
    ]);

    const todayBookings = todayHotelBookings + todayGenericBookings;

    // TOTAL REVENUE
    const [hotelRevenueAgg, genericRevenueAgg] = await Promise.all([
      Booking.aggregate([
        {
          $match: {
            paymentStatus: "paid",
          },
        },

        {
          $group: {
            _id: null,

            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),

      GenericBooking.aggregate([
        {
          $match: {
            paymentStatus: "paid",
          },
        },

        {
          $group: {
            _id: null,

            totalRevenue: {
              $sum: "$pricing.totalAmount",
            },
          },
        },
      ]),
    ]);

    const hotelRevenue = hotelRevenueAgg[0]?.totalRevenue || 0;

    const genericRevenue = genericRevenueAgg[0]?.totalRevenue || 0;

    const totalRevenue = hotelRevenue + genericRevenue;

    // DAILY BOOKINGS CHART
    const startDate = new Date();

    startDate.setDate(startDate.getDate() - (bookingRange - 1));

    startDate.setHours(0, 0, 0, 0);

    const [hotelDailyRaw, genericDailyRaw] = await Promise.all([
      Booking.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
            },
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

            count: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            _id: 1,
          },
        },
      ]),

      GenericBooking.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
            },
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

            count: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            _id: 1,
          },
        },
      ]),
    ]);

    const dailyBookings = [];

    for (let i = 0; i < bookingRange; i++) {
      const date = new Date(startDate);

      date.setDate(date.getDate() + i);

      const formatted = date.toISOString().split("T")[0];

      const hotelFound = hotelDailyRaw.find((d) => d._id === formatted);

      const genericFound = genericDailyRaw.find((d) => d._id === formatted);

      dailyBookings.push({
        date: formatted,

        count: (hotelFound?.count || 0) + (genericFound?.count || 0),
      });
    }

    // MONTHLY REVENUE CHART
    const startMonth = new Date();

    startMonth.setMonth(startMonth.getMonth() - (revenueRange - 1));

    startMonth.setDate(1);

    startMonth.setHours(0, 0, 0, 0);

    const [hotelMonthlyRaw, genericMonthlyRaw] = await Promise.all([
      Booking.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startMonth,
            },

            paymentStatus: "paid",
          },
        },

        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },

              month: {
                $month: "$createdAt",
              },
            },

            revenue: {
              $sum: "$totalAmount",
            },
          },
        },

        {
          $sort: {
            "_id.year": 1,

            "_id.month": 1,
          },
        },
      ]),

      GenericBooking.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startMonth,
            },

            paymentStatus: "paid",
          },
        },

        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },

              month: {
                $month: "$createdAt",
              },
            },

            revenue: {
              $sum: "$pricing.totalAmount",
            },
          },
        },

        {
          $sort: {
            "_id.year": 1,

            "_id.month": 1,
          },
        },
      ]),
    ]);

    const monthlyRevenue = [];

    for (let i = 0; i < revenueRange; i++) {
      const date = new Date(startMonth);

      date.setMonth(date.getMonth() + i);

      const month = date.getMonth() + 1;

      const year = date.getFullYear();

      const hotelFound = hotelMonthlyRaw.find(
        (m) => m._id.month === month && m._id.year === year,
      );

      const genericFound = genericMonthlyRaw.find(
        (m) => m._id.month === month && m._id.year === year,
      );

      monthlyRevenue.push({
        month: `${year}-${month.toString().padStart(2, "0")}`,

        revenue: (hotelFound?.revenue || 0) + (genericFound?.revenue || 0),
      });
    }

    // SERVICE STATS
    const genericServiceStats = await GenericBooking.aggregate([
      {
        $group: {
          _id: "$serviceType",

          totalBookings: {
            $sum: 1,
          },

          revenue: {
            $sum: "$pricing.totalAmount",
          },
        },
      },
    ]);

    const hotelStats = await Booking.aggregate([
      {
        $group: {
          _id: "hotel",

          totalBookings: {
            $sum: 1,
          },

          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const serviceStats = [...hotelStats, ...genericServiceStats];

    return {
      stats: {
        totalUsers,

        totalProperties,

        totalBookings,

        todayBookings,

        totalRevenue,
      },

      charts: {
        dailyBookings,

        monthlyRevenue,
      },

      serviceStats,
    };
  } catch (error) {
    throw error;
  }
};

exports.getRecentBookings = async () => {
  try {
    // HOTEL BOOKINGS
    const hotelBookings = await Booking.aggregate([
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

          propertyName: "$hotel.name",

          serviceType: {
            $literal: "hotel",
          },

          bookingDate: "$createdAt",

          amount: "$totalAmount",

          status: 1,

          createdAt: 1,
        },
      },
    ]);

    // GENERIC BOOKINGS
    const genericBookings = await GenericBooking.aggregate([
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

      {
        $project: {
          _id: 1,

          bookingReference: 1,

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

          propertyName: "$serviceSnapshot.title",

          serviceType: 1,

          bookingDate: "$bookingDate",

          amount: "$pricing.totalAmount",

          status: 1,

          createdAt: 1,
        },
      },
    ]);

    // COMBINE + SORT
    const combinedBookings = [...hotelBookings, ...genericBookings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    return combinedBookings;
  } catch (error) {
    throw error;
  }
};
