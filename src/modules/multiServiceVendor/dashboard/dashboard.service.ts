import Booking from "../../multiServiceBookings/booking.model";

export const getDashboardStats = async (query: any = {}, vendor: any) => {
  try {
    const baseFilter: any = {
      vendorId: vendor._id,
      serviceType: vendor.serviceType,
    };

    const activeFilter: any = {
      ...baseFilter,
      status: { $ne: "cancelled" },
    };

    // Total Bookings (excluding cancelled)
    const totalBookingsPromise = Booking.countDocuments(activeFilter);

    // New Bookings (Today)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const newBookingsPromise = Booking.countDocuments({
      ...activeFilter,
      createdAt: { $gte: todayStart },
    });

    // Cancelled Bookings (separate filter)
    const cancelledBookingsPromise = Booking.countDocuments({
      ...baseFilter,
      status: "cancelled",
    });

    // Total Revenue (only paid + not cancelled)
    const revenuePromise = Booking.aggregate([
      {
        $match: {
          ...activeFilter,
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$pricing.totalAmount" },
        },
      },
    ]);

    const [totalBookings, newBookings, cancelledBookings, revenueResult]: any =
      await Promise.all([
        totalBookingsPromise,
        newBookingsPromise,
        cancelledBookingsPromise,
        revenuePromise,
      ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    return {
      totalRevenue,
      totalBookings,
      newBookings,
      cancelledBookings,
    };
  } catch (error) {
    throw error;
  }
};

export const getDashboardAnalytics = async (query: any = {}, vendor: any) => {
  try {
    const { revenueRange = "6m", bookingRange = "7d" } = query;

    const now = new Date();

    const baseFilter: any = {
      vendorId: vendor._id,
      serviceType: vendor.serviceType,
    };

    // Revenue Graph (Monthly)
    let months = 6;
    if (revenueRange === "3m") months = 3;
    if (revenueRange === "12m") months = 12;

    const revenueStartDate = new Date();
    revenueStartDate.setMonth(now.getMonth() - months);

    const revenueData = await Booking.aggregate([
      {
        $match: {
          ...baseFilter,
          paymentStatus: "paid",
          status: { $ne: "cancelled" },
          createdAt: { $gte: revenueStartDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$pricing.totalAmount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const formattedRevenue = revenueData.map((item: any) => ({
      month: `${item._id.month}-${item._id.year}`,
      revenue: item.totalRevenue,
    }));

    // BOOKINGS GRAPH (DAILY)

    let days = 7;
    if (bookingRange === "15d") days = 15;
    if (bookingRange === "30d") days = 30;

    const bookingStartDate = new Date();
    bookingStartDate.setDate(now.getDate() - days);

    const bookingData = await Booking.aggregate([
      {
        $match: {
          ...baseFilter,
          status: { $ne: "cancelled" },
          createdAt: { $gte: bookingStartDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalBookings: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1,
        },
      },
    ]);

    const formattedBookings = bookingData.map((item: any) => ({
      date: `${item._id.day}-${item._id.month}`,
      bookings: item.totalBookings,
    }));

    return {
      revenue: formattedRevenue,
      bookings: formattedBookings,
    };
  } catch (error) {
    throw error;
  }
};

export const getRecentBookings = async (query: any = {}, vendor: any) => {
  try {
    const { status, page = 1, limit = 10 } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {
      vendorId: vendor._id,
      serviceType: vendor.serviceType,
    };

    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select(
        "bookingReference serviceType bookingDate pricing.totalAmount status paymentStatus primaryCustomer serviceSnapshot duration extraInfo quantity",
      )
      .lean();

    const total = await Booking.countDocuments(filter);

    // FORMAT (MULTI-SERVICE )
    const formattedBookings = bookings.map((b: any) => {
      let serviceDetails = "";

      // Adventure
      if (b.serviceType === "adventure") {
        serviceDetails = `${b.quantity} Person`;
      }

      // Cab
      if (b.serviceType === "cab") {
        serviceDetails = b.extraInfo?.value || "Route N/A";
      }

      // Bike
      if (b.serviceType === "bike") {
        serviceDetails = `${b.duration?.totalDays || 0} Days`;
      }

      // Tour
      if (b.serviceType === "tour") {
        serviceDetails = `${b.quantity} Person • ${
          b.duration?.totalDays || 0
        } Days`;
      }

      return {
        id: b._id,
        bookingReference: b.bookingReference,

        customerName: `${b.primaryCustomer?.firstName || ""} ${
          b.primaryCustomer?.lastName || ""
        }`.trim(),

        serviceTitle: b.serviceSnapshot?.title || "N/A",
        serviceType: b.serviceType,

        serviceDetails,

        bookingDate: b.bookingDate,

        amount: b.pricing?.totalAmount || 0,

        status: b.status,
        paymentStatus: b.paymentStatus,
      };
    });

    return {
      count: formattedBookings.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: formattedBookings,
    };
  } catch (error) {
    throw error;
  }
};

export class MultiServiceVendorDashboardService {
  async getDashboardStats(query: any = {}, vendor: any) {
    return getDashboardStats(query, vendor);
  }

  async getDashboardAnalytics(query: any = {}, vendor: any) {
    return getDashboardAnalytics(query, vendor);
  }

  async getRecentBookings(query: any = {}, vendor: any) {
    return getRecentBookings(query, vendor);
  }
}

export const multiServiceVendorDashboardService = new MultiServiceVendorDashboardService();

export default multiServiceVendorDashboardService;

