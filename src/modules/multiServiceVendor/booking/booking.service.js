const mongoose = require("mongoose");
const Booking = require("../../multiServiceBookings/booking.model");

exports.getVendorBookings = async (query = {}, vendor) => {
  try {
    const { status, search, page = 1, limit = 10 } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const filter = {
      vendorId: vendor._id,
      serviceType: vendor.serviceType,
    };

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { bookingReference: { $regex: search, $options: "i" } },
        { "primaryCustomer.firstName": { $regex: search, $options: "i" } },
        { "primaryCustomer.lastName": { $regex: search, $options: "i" } },
      ];
    }

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select(
        "bookingReference serviceType bookingDate extraInfo pricing.totalAmount status paymentStatus primaryCustomer serviceSnapshot duration quantity",
      )
      .lean();

    const total = await Booking.countDocuments(filter);

    // MULTI-SERVICE FORMAT
    const formattedBookings = bookings.map((b) => {
      let serviceDetails = "";

      if (b.serviceType === "adventure") {
        serviceDetails = `${b.quantity} Person`;
      }

      if (b.serviceType === "cab") {
        serviceDetails = b.extraInfo?.value || "Route N/A";
      }

      if (b.serviceType === "bike") {
        serviceDetails = `${b.duration?.totalDays || 0} Days`;
      }

      if (b.serviceType === "tour") {
        serviceDetails = `${b.quantity} Person • ${
          b.duration?.totalDays || 0
        } Days`;
      }

      return {
        id: b._id,
        bookingReference: b.bookingReference,

        customerName: `${b.primaryCustomer.firstName} ${
          b.primaryCustomer.lastName || ""
        }`,

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
      pages: Math.ceil(total / limit),
      data: formattedBookings,
    };
  } catch (error) {
    throw error;
  }
};

exports.getVendorBookingById = async (bookingId, vendor) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new Error("Invalid booking id");
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      vendorId: vendor._id,
      serviceType: vendor.serviceType,
    })
      .select(
        "bookingReference serviceType serviceSnapshot bookingDate timeSlot primaryCustomer participants meta extraInfo duration quantity pricing status paymentStatus createdAt",
      )
      .lean();

    if (!booking) {
      throw new Error("Booking not found");
    }

    // MULTI-SERVICE DETAILS
    let serviceDetails = {};

    if (booking.serviceType === "adventure") {
      serviceDetails = {
        persons: booking.quantity,
        info: booking.extraInfo,
      };
    }

    if (booking.serviceType === "cab") {
      serviceDetails = {
        route: booking.extraInfo?.value || "N/A",
      };
    }

    if (booking.serviceType === "bike") {
      serviceDetails = {
        days: booking.duration?.totalDays || 1,
        startDate: booking.duration?.startDate,
        endDate: booking.duration?.endDate,
      };
    }

    if (booking.serviceType === "tour") {
      serviceDetails = {
        persons: booking.quantity,
        days: booking.duration?.totalDays || 0,
        startDate: booking.duration?.startDate,
      };
    }

    const formattedBooking = {
      id: booking._id,

      bookingReference: booking.bookingReference,

      service: {
        title: booking.serviceSnapshot?.title || "N/A",
        type: booking.serviceType,
        subType: booking.serviceSnapshot?.type || null,
        details: serviceDetails,
      },

      customer: {
        name: `${booking.primaryCustomer.firstName} ${
          booking.primaryCustomer.lastName || ""
        }`,
        email: booking.primaryCustomer.email,
        phone: booking.primaryCustomer.phoneNumber,
      },

      bookingDate: booking.bookingDate,
      timeSlot: booking.timeSlot || null,

      participants: booking.participants || [],

      meta: booking.meta || {},
      extraInfo: booking.extraInfo || {},

      pricing: {
        baseAmount: booking.pricing?.baseAmount || 0,
        taxAmount: booking.pricing?.taxAmount || 0,
        taxPercentage: booking.pricing?.taxPercentage || 0,
        totalAmount: booking.pricing?.totalAmount || 0,
      },

      quantity: booking.quantity,
      duration: booking.duration || null,

      status: booking.status,
      paymentStatus: booking.paymentStatus,

      createdAt: booking.createdAt,
    };

    return formattedBooking;
  } catch (error) {
    throw error;
  }
};
