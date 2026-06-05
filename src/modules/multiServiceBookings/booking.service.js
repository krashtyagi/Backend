const mongoose = require("mongoose");
const crypto = require("crypto");
const razorpay = require("../../shared/config/razorpay");
const Booking = require("./booking.model");
const Payment = require("./payment.model");
const Tax = require("../admin/tax/tax.model");

const logger = require("../../shared/utils/logger");

const AdventureService = require("../adventure/service/service.model");
const CabService = require("../cab/service/cabService.model");
const BikeService = require("../bike/service/bikeService.model");
const TourService = require("../tour/service/tourService.model");

exports.createBooking = async (data, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      serviceType,
      serviceId,
      bookingDate,
      timeSlot,
      primaryCustomer,
      participants = [],
      meta = {},
    } = data;

    if (!serviceType || !serviceId || !bookingDate) {
      throw new Error("serviceType, serviceId and bookingDate are required");
    }

    // //SERVICE MAP

    let service;
    let vendorId;

    if (serviceType === "adventure") {
      service = await AdventureService.findById(serviceId)
        .populate("adventure", "vendorId")
        .lean();

      vendorId = service?.adventure?.vendorId;
    } else if (serviceType === "cab") {
      service = await CabService.findById(serviceId)
        .populate("cab", "vendorId")
        .lean();

      vendorId = service?.cab?.vendorId;
    } else if (serviceType === "bike") {
      service = await BikeService.findById(serviceId)
        .populate("bike", "vendorId")
        .lean();

      vendorId = service?.bike?.vendorId;
    } else if (serviceType === "tour") {
      service = await TourService.findById(serviceId)
        .populate("tour", "vendorId")
        .lean();

      vendorId = service?.tour?.vendorId;
    } else {
      throw new Error("Invalid service type");
    }

    if (!service || !service.isActive) {
      throw new Error("Service not available");
    }

    if (!vendorId) {
      throw new Error("Vendor not found");
    }

    const taxDoc = await Tax.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;

    let effectivePrice = 0;

    if (serviceType === "bike") {
      effectivePrice =
        service.discountPrice > 0 ? service.discountPrice : service.pricePerDay;
    } else {
      effectivePrice =
        service.discountPrice > 0 ? service.discountPrice : service.basePrice;
    }

    let quantity = 1;
    let baseAmount = 0;
    let duration = {};
    let extraInfo = {};

    // ADVENTURE
    if (serviceType === "adventure") {
      quantity = participants.length || 1;
      baseAmount = effectivePrice * quantity;

      extraInfo = {
        label: "Type",
        value: service.type,
      };
    }

    // CAB
    if (serviceType === "cab") {
      if (!meta.pickup || !meta.drop) {
        throw new Error("Pickup and Drop are required");
      }

      quantity = 1;
      baseAmount = effectivePrice;

      extraInfo = {
        label: "Route",
        value: `${meta.pickup} → ${meta.drop}`,
      };
    }

    // BIKE
    if (serviceType === "bike") {
      if (!meta.startDate || !meta.endDate) {
        throw new Error("Start and End date required");
      }

      const start = new Date(meta.startDate);
      const end = new Date(meta.endDate);

      if (start >= end) {
        throw new Error("Invalid date range");
      }

      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      quantity = days;

      duration = {
        startDate: meta.startDate,
        endDate: meta.endDate,
        totalDays: days,
      };

      baseAmount = effectivePrice * days;

      extraInfo = {
        label: "Duration",
        value: `${days} Days`,
      };
    }

    // TOUR
    if (serviceType === "tour") {
      if (!meta.startDate) {
        throw new Error("Tour start date required");
      }

      quantity = participants.length || 1;

      duration = {
        startDate: meta.startDate,
        totalDays: service.duration.days,
      };

      baseAmount = effectivePrice * quantity;

      extraInfo = {
        label: "Package",
        value: `${service.duration.days}D / ${service.duration.nights}N`,
      };
    }

    // TAX CALCULATION
    const taxAmount = Number(((baseAmount * taxPercentage) / 100).toFixed(2));

    const totalAmount = Number((baseAmount + taxAmount).toFixed(2));

    //BOOKING REF
    const bookingReference =
      "BK-" + crypto.randomBytes(6).toString("hex").toUpperCase();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const [booking] = await Booking.create(
      [
        {
          userId,
          vendorId,

          serviceType,
          serviceId,
          bookingReference,

          bookingDate,
          timeSlot,

          duration,

          primaryCustomer,
          participants,

          meta,
          extraInfo,

          quantity,

          pricing: {
            baseAmount,
            taxAmount,
            taxPercentage,
            totalAmount,
          },

          serviceSnapshot: {
            title: service.title,
            type: serviceType,
            price: effectivePrice,
            vendorId,
            extra: extraInfo,
          },

          status: "pending",
          paymentStatus: "pending",
          expiresAt,
        },
      ],
      { session },
    );

    //RAZORPAY ORDER
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: bookingReference,
    });

    const [payment] = await Payment.create(
      [
        {
          bookingId: booking._id,
          userId,
          gatewayOrderId: razorpayOrder.id,
          amount: totalAmount,
          status: "created",
          metadata: {
            serviceType,
            bookingReference,
          },
          expiresAt,
        },
      ],
      { session },
    );

    booking.paymentId = payment._id;
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      booking,
      razorpayOrder,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.verifyPayment = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error("Missing payment verification data");
    }

    const payment = await Payment.findOne({
      gatewayOrderId: razorpay_order_id,
    }).session(session);

    if (!payment) {
      throw new Error("Payment record not found");
    }

    //IDEMPOTENCY
    if (payment.status === "captured") {
      const existingBooking = await Booking.findById(payment.bookingId)
        .lean()
        .session(session);

      await session.commitTransaction();
      session.endSession();

      return {
        booking: existingBooking,
        alreadyVerified: true,
      };
    }

    if (!["created", "authorized"].includes(payment.status)) {
      throw new Error("Invalid payment state");
    }

    //EXPIRY CHECK
    if (payment.expiresAt && payment.expiresAt < new Date()) {
      throw new Error("Payment session expired");
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);

    if (razorpayPayment.status !== "captured") {
      throw new Error("Payment not captured");
    }

    if (razorpayPayment.order_id !== razorpay_order_id) {
      throw new Error("Order mismatch");
    }

    if (razorpayPayment.amount / 100 !== payment.amount) {
      throw new Error("Amount mismatch from gateway");
    }

    payment.gatewayPaymentId = razorpay_payment_id;
    payment.gatewaySignature = razorpay_signature;
    payment.status = "captured";
    payment.isVerified = true;
    payment.paymentMethod = razorpayPayment.method || "unknown";
    payment.currency = razorpayPayment.currency || "INR";
    payment.expiresAt = undefined;

    await payment.save({ session });

    const booking = await Booking.findById(payment.bookingId).session(session);

    if (!booking) {
      throw new Error("Booking not found");
    }

    //OOKING EXPIRY CHECK
    if (booking.expiresAt && booking.expiresAt < new Date()) {
      throw new Error("Booking expired. Please create a new booking.");
    }

    if (booking.status !== "pending") {
      throw new Error("Invalid booking state");
    }

    if (
      Number(payment.amount.toFixed(2)) !==
      Number(booking.pricing.totalAmount.toFixed(2))
    ) {
      throw new Error("Payment amount mismatch");
    }

    // ATOMIC UPDATE
    const updatedBooking = await Booking.findOneAndUpdate(
      {
        _id: booking._id,
        status: "pending",
        paymentStatus: "pending",
        expiresAt: { $gt: new Date() },
      },
      {
        status: "confirmed",
        paymentStatus: "paid",
        $unset: { expiresAt: 1 },
      },
      { new: true, session },
    );

    if (!updatedBooking) {
      throw new Error("Booking expired or already processed");
    }

    await session.commitTransaction();
    session.endSession();

    return {
      booking: updatedBooking,
      alreadyVerified: false,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    logger.error("Service Error: verifyPayment", {
      message: error.message,
      orderId: data?.razorpay_order_id,
    });

    throw error;
  }
};
