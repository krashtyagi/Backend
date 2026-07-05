const Booking = require("./booking.model");
const Availability = require("../availability/availability.model");
const mongoose = require("mongoose");
const logger = require("../../shared/utils/logger");
const trivlloData = require("../../../trivllo.json");
const Payment = require("../payments/payment.model");
const Hotel = require("../hotels/hotel.model");
const Tax = require("../admin/tax/tax.model");

const razorpay = require("../../shared/config/razorpay");

const Room = require("../rooms/room.model");

const crypto = require("crypto");
const PDFDocument = require("pdfkit");

const RoomType = require("../rooms/roomType.model");

const GenericBooking = require("../multiServiceBookings/booking.model");
const TourService = require("../tour/company/tour.model");
const CabService = require("../cab/company/cab.model");
const BikeService = require("../bike/company/bike.model");
const AdventureService = require("../adventure/category/adventure.model");

//restore availability function
async function restoreAvailability(booking, session) {
  const currentDate = new Date(booking.checkIn);

  while (currentDate < booking.checkOut) {
    await Availability.findOneAndUpdate(
      {
        roomTypeId: booking.roomTypeId,
        date: new Date(currentDate),
      },
      { $inc: { availableRooms: booking.roomsBooked } },
      { session },
    );

    currentDate.setDate(currentDate.getDate() + 1);
  }
}

//process refund function
async function processRefund(booking, session) {
  const payment = await Payment.findById(booking.paymentId).session(session);

  if (!payment || payment.status !== "captured")
    throw new Error("Payment not eligible for refund");

  const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
    amount: booking.refundAmount * 100, // Razorpay expects paise
  });

  payment.status = "refunded";
  payment.refundStatus = "processed";
  payment.refundAmount = booking.refundAmount;
  payment.razorpayRefundId = refund.id;
  payment.refundedAt = new Date();

  await payment.save({ session });
}

exports.createBooking = async (data, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      hotelId,
      roomTypeId,
      checkIn,
      checkOut,
      guests,
      roomsBooked,
      primaryGuest,
      additionalGuests = [],
    } = data;

    if (!checkIn || !checkOut)
      throw new Error("Check-in and Check-out dates are required");

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (startDate >= endDate)
      throw new Error("Invalid check-in/check-out dates");

    const nights = (endDate - startDate) / (1000 * 60 * 60 * 24);
    if (nights <= 0) throw new Error("Invalid booking duration");

    const rooms = roomsBooked && roomsBooked > 0 ? roomsBooked : 1;

    if (!guests?.adults || guests.adults <= 0)
      throw new Error("At least one adult guest is required");

    const expectedAdditionalGuests =
      (guests.adults || 0) + (guests.children || 0) - 1;

    if (additionalGuests.length !== expectedAdditionalGuests)
      throw new Error("Additional guests count mismatch");

    const hotel = await Hotel.findById(hotelId).session(session);
    if (!hotel || !hotel.isActive) throw new Error("Hotel not available");

    const roomType = await RoomType.findById(roomTypeId).session(session);
    if (!roomType || !roomType.isActive)
      throw new Error("Room type not available");

    if (
      guests.adults > roomType.capacity.adults ||
      guests.children > roomType.capacity.children
    ) {
      throw new Error("Guest count exceeds room capacity");
    }

    const taxDoc = await Tax.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;

    //FETCH AVAILABILITY
    const availabilityDocs = await Availability.find({
      roomTypeId,
      date: { $gte: startDate, $lt: endDate },
    }).session(session);

    //MAP BUILD
    const availabilityMap = {};
    for (const doc of availabilityDocs) {
      const dateStr = doc.date.toISOString().split("T")[0];
      availabilityMap[dateStr] = doc;
    }

    let totalBasePrice = 0;
    let firstDayPrice = 0;

    //VALIDATION + PRICE CALCULATION
    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(startDate.getTime() + i * 86400000);
      const dateStr = currentDate.toISOString().split("T")[0];

      const dayDoc = availabilityMap[dateStr];

      const booked = dayDoc?.bookedRooms || 0;
      const blocked = dayDoc?.blockedRooms || 0;

      const available = roomType.totalRooms - booked - blocked;

      if (available < rooms) {
        throw new Error(
          `Insufficient availability on ${currentDate.toDateString()}`,
        );
      }

      const price =
        dayDoc?.priceOverride ??
        (roomType.discountPrice > 0
          ? roomType.discountPrice
          : roomType.basePrice);

      if (i === 0) firstDayPrice = price;

      totalBasePrice += price * rooms;
    }

    //TAX CALCULATION
    const totalTax = Number(
      ((totalBasePrice * taxPercentage) / 100).toFixed(2),
    );
    const finalTotalAmount = Number((totalBasePrice + totalTax).toFixed(2));

    const bookingReference =
      "BK-" + crypto.randomBytes(6).toString("hex").toUpperCase();

    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes expiry

    const [booking] = await Booking.create(
      [
        {
          userId,
          hotelId,
          roomTypeId,
          bookingReference,
          checkIn: startDate,
          checkOut: endDate,
          nights,
          guests,
          roomsBooked: rooms,
          primaryGuest,
          additionalGuests,

          pricePerNight: firstDayPrice,
          taxAmount: totalTax,
          totalAmount: finalTotalAmount,

          status: "pending",
          paymentStatus: "pending",
          expiresAt,
        },
      ],
      { session },
    );

    //RAZORPAY ORDER (WITH TAX)
    const razorpayOrder = await razorpay.orders.create({
      amount: finalTotalAmount * 100,
      currency: "INR",
      receipt: bookingReference,
    });

    const [payment] = await Payment.create(
      [
        {
          bookingId: booking._id,
          userId,
          razorpayOrderId: razorpayOrder.id,
          amountPaid: finalTotalAmount,
          status: "created",
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
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    logger.error("Service Error: createBooking", err);
    throw err;
  }
};

// exports.getUserBookings = async (userId) => {
//   try {
//     const bookings = await Booking.find({ userId })
//       .populate({
//         path: "hotelId",
//         select: "name images",
//       })
//       .sort({ createdAt: -1 })
//       .lean();

//     return bookings.map((booking) => ({
//       hotelId: booking.hotelId._id,
//       _id: booking._id,
//       bookingReference: booking.bookingReference,
//       hotelName: booking.hotelId?.name,
//       thumbnail: booking.hotelId?.images?.[0]?.url || null,
//       checkIn: booking.checkIn,
//       checkOut: booking.checkOut,
//       guests: booking.guests,
//       status: booking.status,
//       totalAmount: booking.totalAmount,
//     }));
//   } catch (error) {
//     logger.error("Service Error: getUserBookings", error);
//     throw error;
//   }
// };

//Get booking detail by id

exports.getUserBookings = async (userId) => {
  try {
    const [hotelBookings, genericBookings] = await Promise.all([
      Booking.find({ userId })
        .populate({
          path: "hotelId",
          select: "name images",
        })
        .lean(),

      GenericBooking.find({ userId }).lean(),
    ]);

    // Group serviceIds by type
    const adventureIds = [];
    const bikeIds = [];
    const cabIds = [];
    const tourIds = [];

    genericBookings.forEach((booking) => {
      switch (booking.serviceType) {
        case "adventure":
          adventureIds.push(booking.serviceId);
          break;

        case "bike":
          bikeIds.push(booking.serviceId);
          break;

        case "cab":
          cabIds.push(booking.serviceId);
          break;

        case "tour":
          tourIds.push(booking.serviceId);
          break;
      }
    });

    const [adventureServices, bikeServices, cabServices, tourServices] =
      await Promise.all([
        adventureIds.length
          ? AdventureService.find({
              _id: { $in: adventureIds },
            })
              .select("title images")
              .lean()
          : [],

        bikeIds.length
          ? BikeService.find({
              _id: { $in: bikeIds },
            })
              .select("title images bikeName")
              .lean()
          : [],

        cabIds.length
          ? CabService.find({
              _id: { $in: cabIds },
            })
              .select("title images carName pickupLocation dropLocation")
              .lean()
          : [],

        tourIds.length
          ? TourService.find({
              _id: { $in: tourIds },
            })
              .select("title images destinations")
              .lean()
          : [],
      ]);

    // Create lookup maps
    const adventureMap = new Map(
      adventureServices.map((item) => [item._id.toString(), item]),
    );

    const bikeMap = new Map(
      bikeServices.map((item) => [item._id.toString(), item]),
    );

    const cabMap = new Map(
      cabServices.map((item) => [item._id.toString(), item]),
    );

    const tourMap = new Map(
      tourServices.map((item) => [item._id.toString(), item]),
    );

    const formattedGenericBookings = genericBookings.map((booking) => {
      let service = null;

      switch (booking.serviceType) {
        case "adventure":
          service = adventureMap.get(booking.serviceId.toString());
          break;

        case "bike":
          service = bikeMap.get(booking.serviceId.toString());
          break;

        case "cab":
          service = cabMap.get(booking.serviceId.toString());
          break;

        case "tour":
          service = tourMap.get(booking.serviceId.toString());
          break;
      }

      return {
        _id: booking._id,
        bookingReference: booking.bookingReference,

        bookingType: booking.serviceType,

        title: service?.title || booking.serviceSnapshot?.title || "Service",

        thumbnail: service?.images?.[0]?.url || null,

        bookingDate: booking.duration?.startDate || booking.bookingDate,

        status: booking.status,
        paymentStatus: booking.paymentStatus,

        totalAmount: booking.pricing?.totalAmount || 0,

        createdAt: booking.createdAt,
      };
    });

    const formattedHotelBookings = hotelBookings.map((booking) => ({
      _id: booking._id,
      bookingReference: booking.bookingReference,

      bookingType: "hotel",

      title: booking.hotelId?.name || "Hotel",

      thumbnail: booking.hotelId?.images?.[0]?.url || null,

      bookingDate: booking.checkIn,

      status: booking.status,
      paymentStatus: booking.paymentStatus,

      totalAmount: booking.totalAmount,

      createdAt: booking.createdAt,
    }));

    return [...formattedHotelBookings, ...formattedGenericBookings].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  } catch (error) {
    logger.error("Service Error: getUserBookings", error);
    throw error;
  }
};

// exports.getBookingDetail = async (bookingId, userId) => {
//   try {
//     const booking = await Booking.findOne({
//       _id: bookingId,
//       userId,
//     })
//       .populate("hotelId", "name description address location images")
//       .populate("roomTypeId", "name amenities bedType roomSizeSqm")
//       .lean();

//     if (!booking) throw new Error("Booking not found");

//     return {
//       bookingReference: booking.bookingReference,

//       status: booking.status,
//       paymentStatus: booking.paymentStatus,

//       hotel: {
//         hotelId: booking.hotelId._id,
//         name: booking.hotelId.name,
//         address: booking.hotelId.address,
//         coordinates: booking.hotelId.location?.coordinates,
//         thumbnail: booking.hotelId.images?.[0]?.url || null,
//         address: booking.hotelId.address,
//       },

//       room: {
//         name: booking.roomTypeId.name,
//         amenities: booking.roomTypeId.amenities,
//         bedType: booking.roomTypeId.bedType,
//         roomSizeSqm: booking.roomTypeId.roomSizeSqm,
//       },

//       checkIn: booking.checkIn,
//       checkOut: booking.checkOut,
//       nights: booking.nights,
//       roomsBooked: booking.roomsBooked,
//       guests: booking.guests,

//       priceBreakdown: {
//         pricePerNight: booking.pricePerNight,
//         taxAmount: booking.taxAmount,
//         cleaningFee: booking.cleaningFee,
//         discountAmount: booking.discountAmount,
//         totalAmount: booking.totalAmount,
//       },
//     };
//   } catch (error) {
//     logger.error("Service Error: getBookingDetail", error);
//     throw error;
//   }
// };

//download user invoice

exports.getBookingDetail = async (bookingId, userId) => {
  try {
    // HOTEL BOOKING
    const hotelBooking = await Booking.findOne({
      _id: bookingId,
      userId,
    })
      .populate("hotelId", "name description address location images")
      .populate("roomTypeId", "name amenities bedType roomSizeSqm")
      .lean();

    if (hotelBooking) {
      return {
        bookingType: "hotel",

        bookingReference: hotelBooking.bookingReference,

        status: hotelBooking.status,
        paymentStatus: hotelBooking.paymentStatus,

        hotel: {
          hotelId: hotelBooking.hotelId?._id,
          name: hotelBooking.hotelId?.name,
          address: hotelBooking.hotelId?.address,
          coordinates: hotelBooking.hotelId?.location?.coordinates,
          thumbnail: hotelBooking.hotelId?.images?.[0]?.url || null,
        },

        room: {
          name: hotelBooking.roomTypeId?.name,
          amenities: hotelBooking.roomTypeId?.amenities || [],
          bedType: hotelBooking.roomTypeId?.bedType,
          roomSizeSqm: hotelBooking.roomTypeId?.roomSizeSqm,
        },

        checkIn: hotelBooking.checkIn,
        checkOut: hotelBooking.checkOut,
        nights: hotelBooking.nights,

        guests: hotelBooking.guests,
        roomsBooked: hotelBooking.roomsBooked,

        priceBreakdown: {
          pricePerNight: hotelBooking.pricePerNight,
          taxAmount: hotelBooking.taxAmount,
          cleaningFee: hotelBooking.cleaningFee,
          discountAmount: hotelBooking.discountAmount,
          totalAmount: hotelBooking.totalAmount,
        },

        createdAt: hotelBooking.createdAt,
      };
    }

    // GENERIC BOOKING
    const booking = await GenericBooking.findOne({
      _id: bookingId,
      userId,
    }).lean();

    if (!booking) {
      throw new Error("Booking not found");
    }

    let service = null;

    switch (booking.serviceType) {
      case "adventure":
        service = await AdventureService.findById(booking.serviceId)
          .select("title images features description category")
          .lean();
        break;

      case "bike":
        service = await BikeService.findById(booking.serviceId)
          .select("title bikeName bikeType images features description")
          .lean();
        break;

      case "cab":
        service = await CabService.findById(booking.serviceId)
          .select(
            "title carName cabType pickupLocation dropLocation images features",
          )
          .lean();
        break;

      case "tour":
        service = await TourService.findById(booking.serviceId)
          .select(
            "title images destinations duration itinerary features description",
          )
          .lean();
        break;
    }

    return {
      bookingType: booking.serviceType,
      bookingReference: booking.bookingReference,
      status: booking.status,
      paymentStatus: booking.paymentStatus,

      service: {
        serviceId: booking.serviceId,

        title: service?.title || booking.serviceSnapshot?.title,
        thumbnail: service?.images?.[0]?.url || null,
        description: service?.description || "",
        features: service?.features || [],
        details: service || {},
      },

      bookingInfo: {
        bookingDate: booking.bookingDate,
        duration: booking.duration,
        participants: booking.participants,
        quantity: booking.quantity,
        specialRequest: booking.specialRequest || "",
      },

      customer: booking.primaryCustomer,

      pricing: {
        baseAmount: booking.pricing?.baseAmount || 0,
        taxAmount: booking.pricing?.taxAmount || 0,
        discountAmount: booking.pricing?.discountAmount || 0,
        totalAmount: booking.pricing?.totalAmount || 0,
      },

      createdAt: booking.createdAt,
    };
  } catch (error) {
    logger.error("Service Error: getBookingDetail", error);
    throw error;
  }
};

exports.userInvoiceDownload = async (booking, res) => {
  const hotel = await Hotel.findById(booking.hotelId).lean();
  if (!hotel) throw new Error("Hotel not found");

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${booking.bookingReference}.pdf`,
  );
  res.setHeader("Content-Type", "application/pdf");

  const doc = new PDFDocument({ margin: 50, size: "A4" });
  doc.pipe(res);

  // --- THEME & COLORS ---
  const brandColor = "#2563EB"; // Modern Tailwind Blue-600
  const brandDark = "#1E293B"; // Slate-800
  const textMuted = "#64748B"; // Slate-500
  const borderLight = "#E2E8F0"; // Slate-200
  const brandRed = "#EF4444"; // Red-500
  const bgLight = "#F8FAFC"; // Slate-50

  const companyName = typeof trivlloData !== "undefined" && trivlloData.company_name ? trivlloData.company_name : "Trivllo";

  // --- HEADER ---
  // Logo
  doc.circle(70, 70, 20).fill(brandColor);
  doc
    .fillColor("#FFFFFF")
    .fontSize(20)
    .font("Helvetica-Bold")
    .text(companyName.charAt(0).toUpperCase(), 60, 62, { width: 20, align: "center" });

  doc
    .fillColor(brandDark)
    .fontSize(24)
    .font("Helvetica-Bold")
    .text(companyName, 100, 60);

  // INVOICE Title
  doc
    .fillColor(brandColor)
    .fontSize(28)
    .font("Helvetica-Bold")
    .text("INVOICE", 50, 55, { align: "right" });

  doc
    .fillColor(textMuted)
    .fontSize(10)
    .font("Helvetica")
    .text(`Booking Ref: ${booking.bookingReference}`, 50, 85, { align: "right" })
    .text(`Date: ${new Date().toLocaleDateString()}`, 50, 100, { align: "right" });

  // Divider
  doc.moveTo(50, 130).lineTo(545, 130).strokeColor(borderLight).lineWidth(1).stroke();

  // --- STATUS BANNER ---
  doc.moveDown(2);
  const statusY = 150;

  doc.roundedRect(50, statusY, 495, 40, 6).fill(bgLight);
  doc.fillColor(textMuted).fontSize(10).font("Helvetica-Bold").text("BOOKING STATUS", 70, statusY + 14);

  const statusColor = booking.status === "confirmed" ? "#10B981" : "#F59E0B";
  doc.fillColor(statusColor).fontSize(12).font("Helvetica-Bold").text(booking.status?.toUpperCase() || "PENDING", 180, statusY + 13);

  doc.fillColor(textMuted).fontSize(10).font("Helvetica-Bold").text("PAYMENT STATUS", 320, statusY + 14);
  const paymentColor = booking.paymentStatus === "paid" ? "#10B981" : "#F59E0B";
  doc.fillColor(paymentColor).fontSize(12).font("Helvetica-Bold").text(booking.paymentStatus?.toUpperCase() || "PENDING", 430, statusY + 13);

  // --- INFO SECTIONS (Guest & Hotel) ---
  const infoY = 220;

  // Bill To (Guest)
  doc.fillColor(textMuted).fontSize(10).font("Helvetica-Bold").text("BILLED TO:", 50, infoY);
  doc.fillColor(brandDark).fontSize(12).font("Helvetica-Bold").text(`${booking.primaryGuest?.firstName || ''} ${booking.primaryGuest?.lastName || ''}`.trim() || "Guest", 50, infoY + 15);
  doc.fillColor(textMuted).fontSize(10).font("Helvetica").text(booking.primaryGuest?.email || "", 50, infoY + 30);
  doc.text(booking.primaryGuest?.phoneNumber || "", 50, infoY + 45);

  // Hotel Info
  doc.fillColor(textMuted).fontSize(10).font("Helvetica-Bold").text("HOTEL DETAILS:", 300, infoY);
  doc.fillColor(brandDark).fontSize(12).font("Helvetica-Bold").text(hotel.name, 300, infoY + 15);
  doc.fillColor(textMuted).fontSize(10).font("Helvetica").text(`${hotel.address || ''}, ${hotel.city || ''}`, 300, infoY + 30);

  // --- STAY DETAILS ---
  const stayY = 300;
  doc.roundedRect(50, stayY, 495, 60, 6).strokeColor(borderLight).stroke();
  doc.moveTo(297, stayY).lineTo(297, stayY + 60).strokeColor(borderLight).stroke();

  doc.fillColor(textMuted).fontSize(10).font("Helvetica-Bold").text("CHECK-IN", 70, stayY + 15);
  doc.fillColor(brandDark).fontSize(12).font("Helvetica-Bold").text(new Date(booking.checkIn).toDateString(), 70, stayY + 30);

  doc.fillColor(textMuted).fontSize(10).font("Helvetica-Bold").text("CHECK-OUT", 320, stayY + 15);
  doc.fillColor(brandDark).fontSize(12).font("Helvetica-Bold").text(new Date(booking.checkOut).toDateString(), 320, stayY + 30);

  // --- TABLE HEADER ---
  const tableTop = 400;
  doc.roundedRect(50, tableTop, 495, 25, 4).fill(brandDark);

  doc
    .fillColor("#FFFFFF")
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("ROOM DETAILS", 60, tableTop + 8)
    .text("NIGHTS", 250, tableTop + 8)
    .text("GUESTS", 350, tableTop + 8)
    .text("TOTAL", 450, tableTop + 8, { width: 85, align: "right" });

  // --- TABLE ROW ---
  const rowY = tableTop + 40;
  const rt = booking.roomTypeId || {};
  const bedInfo = rt.beds?.map((b) => `${b.quantity} ${b.type}`).join(", ") || "";

  doc.fillColor(brandDark).fontSize(11).font("Helvetica-Bold").text(rt.name || "Standard Room", 60, rowY);
  
  doc
    .fillColor(textMuted)
    .fontSize(9)
    .font("Helvetica")
    .text(`${bedInfo}${bedInfo && rt.roomSizeSqm ? ' | ' : ''}${rt.roomSizeSqm ? rt.roomSizeSqm + ' m²' : ''}`, 60, rowY + 15)
    .text(rt.amenities?.slice(0, 4).join(" • ") || "", 60, rowY + 28);

  doc.fillColor(brandDark).fontSize(10).font("Helvetica").text(`${booking.nights || 1}`, 250, rowY);
  
  const adultCount = booking.guests?.adults || 0;
  const childCount = booking.guests?.children || 0;
  doc.text(`${adultCount}A, ${childCount}C`, 350, rowY);
  
  doc.fontSize(11).font("Helvetica-Bold").text(`Rs. ${(booking.totalAmount || 0).toFixed(2)}`, 450, rowY, { width: 85, align: "right" });

  // Divider below row
  const rowBottom = rowY + 50;
  doc.moveTo(50, rowBottom).lineTo(545, rowBottom).strokeColor(borderLight).stroke();

  // --- TOTALS SECTION ---
  const calcX = 350;
  const valueX = 450;
  const widthV = 85;
  let currentY = rowBottom + 25;

  const nights = booking.nights || 1;
  const basePrice = rt.basePrice || booking.pricePerNight || 0;
  const baseTotal = basePrice * nights;
  
  let discountAmt = 0;
  if (booking.discountAmount !== undefined) {
    discountAmt = booking.discountAmount;
  } else if (rt.discountPrice && rt.basePrice) {
    discountAmt = (rt.basePrice - rt.discountPrice) * nights;
  }

  const drawRow = (label, value, isBold = false, isRed = false) => {
    doc
      .fillColor(isRed ? brandRed : brandDark)
      .fontSize(isBold ? 12 : 10)
      .font(isBold ? "Helvetica-Bold" : "Helvetica");

    doc.text(label, calcX, currentY);
    doc.text(value, valueX, currentY, { width: widthV, align: "right" });
    currentY += 20;
  };

  drawRow("Base Price", `Rs. ${baseTotal.toFixed(2)}`);

  if (discountAmt > 0) {
    const discountPercent = baseTotal > 0 ? Math.round((discountAmt / baseTotal) * 100) : 0;
    drawRow(`Discount (${discountPercent}%)`, `- Rs. ${discountAmt.toFixed(2)}`, false, true);
  }

  const taxes = booking.taxAmount || booking.totalTax || 0;
  drawRow("Taxes & Fees", `Rs. ${taxes.toFixed(2)}`);

  if (booking.cleaningFee) {
    drawRow("Cleaning Fee", `Rs. ${booking.cleaningFee.toFixed(2)}`);
  }

  currentY += 5;
  doc.moveTo(calcX, currentY - 5).lineTo(535, currentY - 5).strokeColor(borderLight).stroke();
  currentY += 5;

  drawRow("GRAND TOTAL", `Rs. ${(booking.totalAmount || 0).toFixed(2)}`, true);

  // --- FOOTER ---
  const footerY = 780;
  doc.moveTo(50, footerY).lineTo(545, footerY).strokeColor(borderLight).stroke();
  doc
    .fillColor(textMuted)
    .fontSize(9)
    .font("Helvetica")
    .text(`Thank you for choosing ${companyName}! For support, please contact us.`, 50, footerY + 15, { align: "center" });

  doc.end();
};

// Refund Preview API
exports.getRefundPreview = async (bookingId, userId) => {
  try {
    const booking = await Booking.findOne({
      _id: bookingId,
      userId,
    });

    if (!booking) throw new Error("Booking not found");

    if (booking.status !== "confirmed") {
      throw new Error("Only confirmed bookings are eligible for cancellation");
    }

    const now = new Date();

    if (booking.checkIn <= now) {
      throw new Error("Cannot cancel past or ongoing bookings");
    }

    const daysBeforeCheckIn = Math.ceil(
      (new Date(booking.checkIn) - now) / (1000 * 60 * 60 * 24),
    );

    let refundPercentage = 0;
    let policyApplied = "";

    const isWithin24Hours =
      now - new Date(booking.createdAt) <= 24 * 60 * 60 * 1000;

    if (isWithin24Hours) {
      refundPercentage = 100;
      policyApplied = "Free cancellation within 24 hours";
    } else if (daysBeforeCheckIn >= 30) {
      refundPercentage = 100;
      policyApplied = "30+ days before check-in";
    } else if (daysBeforeCheckIn >= 15) {
      refundPercentage = 50;
      policyApplied = "15-30 days before check-in";
    } else {
      refundPercentage = 0;
      policyApplied = "Less than 15 days before check-in";
    }

    const refundAmount = Math.round(
      (booking.totalAmount * refundPercentage) / 100,
    );

    return {
      bookingId: booking._id,
      totalAmount: booking.totalAmount,
      refundPercentage,
      refundAmount,
      policyApplied,
      daysBeforeCheckIn,
    };
  } catch (error) {
    throw error;
  }
};

// Cancel Booking Request
exports.cancelBooking = async (bookingId, userId, reason) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findOne({
      _id: bookingId,
      userId,
    }).session(session);

    if (!booking) throw new Error("Booking not found");

    if (booking.status !== "confirmed") {
      throw new Error("Only confirmed bookings can be cancelled");
    }
    if (booking.status === "cancellation_requested") {
      throw new Error("Cancellation already requested");
    }

    const now = new Date();

    if (new Date(booking.checkIn) <= now) {
      throw new Error("Cannot cancel past or ongoing bookings");
    }

    if (!reason || reason.trim() === "") {
      throw new Error("Cancellation reason is required");
    }

    //days calculation
    const daysBeforeCheckIn = Math.ceil(
      (new Date(booking.checkIn) - now) / (1000 * 60 * 60 * 24),
    );

    const isWithin24Hours =
      now - new Date(booking.createdAt) <= 24 * 60 * 60 * 1000;

    let refundPercentage = 0;
    let policyApplied = "";

    if (isWithin24Hours) {
      refundPercentage = 100;
      policyApplied = "Free cancellation within 24 hours";
    } else if (daysBeforeCheckIn >= 30) {
      refundPercentage = 100;
      policyApplied = "30+ days before check-in";
    } else if (daysBeforeCheckIn >= 15) {
      refundPercentage = 50;
      policyApplied = "15-30 days before check-in";
    } else {
      refundPercentage = 0;
      policyApplied = "Less than 15 days before check-in";
    }

    const refundAmount = Math.round(
      (booking.totalAmount * refundPercentage) / 100,
    );

    booking.status = "cancellation_requested";
    booking.refundStatus = refundPercentage > 0 ? "pending" : "none";
    booking.refundPercentage = refundPercentage;
    booking.refundAmount = refundAmount;
    booking.refundRequestedAt = now;
    booking.cancellationReason = reason.trim();
    booking.policyApplied = policyApplied;

    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      message: "Cancellation request submitted successfully",
      bookingId: booking._id,
      refundPercentage,
      refundAmount,
      policyApplied,
      daysBeforeCheckIn,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

//admin approve or reject refund request
exports.adminHandleRefund = async (bookingId, action) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(bookingId).session(session);

    if (!booking) throw new Error("Booking not found");

    if (booking.status !== "cancellation_requested")
      throw new Error("No cancellation pending");

    if (action === "approve") {
      await restoreAvailability(booking, session);

      booking.status = "cancelled";
      booking.refundStatus = "approved";
      booking.cancelledAt = new Date();

      await processRefund(booking, session);

      booking.paymentStatus = "refunded";
      booking.refundProcessedAt = new Date();
    }

    if (action === "reject") {
      booking.status = "confirmed";
      booking.refundStatus = "rejected";
    }

    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    return booking;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    logger.error("Service Error: adminHandleRefund", err);
    throw err;
  }
};

//----------VENDOR Service----------

//get vendor bookings for the dashboard
exports.getVendorBookings = async (vendorId, queryParams) => {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    startDate,
    endDate,
    sort = "-createdAt",
  } = queryParams;

  const skip = (page - 1) * limit;

  const hotels = await Hotel.find({ vendorId }, "_id").lean();
  const hotelIds = hotels.map((h) => h._id);

  const filter = {
    hotelId: { $in: hotelIds },
  };

  if (status) {
    filter.status = status;
  }

  if (startDate && endDate) {
    filter.checkIn = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  if (search) {
    filter.$or = [
      { bookingReference: { $regex: search, $options: "i" } },
      { "primaryGuest.firstName": { $regex: search, $options: "i" } },
      { "primaryGuest.lastName": { $regex: search, $options: "i" } },
    ];
  }

  const bookings = await Booking.find(filter)
    .select(
      "bookingReference primaryGuest roomTypeId roomNumber checkIn checkOut nights status specialRequest",
    )
    .populate("roomTypeId", "name")
    .sort(sort)
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const total = await Booking.countDocuments(filter);

  const formatted = bookings.map((b) => ({
    bookingId: b._id,
    bookingReference: b.bookingReference,
    guestName: `${b.primaryGuest.firstName} ${b.primaryGuest.lastName}`,
    roomLabel: `${b.roomTypeId?.name || ""} ${b.roomNumber || ""}`,
    specialRequest: b.specialRequest || null,
    nights: b.nights,
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    status: b.status,
  }));

  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    count: formatted.length,
    data: formatted,
  };
};

//invoice
exports.getVendorInvoices = async (vendorId, queryParams) => {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    startDate,
    endDate,
    sort = "-createdAt",
  } = queryParams;

  const skip = (page - 1) * limit;

  const hotels = await Hotel.find({ vendorId }, "_id").lean();
  const hotelIds = hotels.map((h) => h._id);

  const filter = {
    hotelId: { $in: hotelIds },
  };

  if (status) {
    filter.paymentStatus = status;
  }

  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  if (search) {
    filter.$or = [
      { bookingReference: { $regex: search, $options: "i" } },
      { "primaryGuest.firstName": { $regex: search, $options: "i" } },
      { "primaryGuest.lastName": { $regex: search, $options: "i" } },
      { roomNumber: { $regex: search, $options: "i" } },
    ];
  }

  const bookings = await Booking.find(filter)
    .select(
      `
      bookingReference
      primaryGuest
      roomTypeId
      roomNumber
      pricePerNight
      nights
      totalAmount
      paymentStatus
    `,
    )
    .populate("roomTypeId", "name")
    .sort(sort)
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const total = await Booking.countDocuments(filter);

  const data = bookings.map((b) => ({
    bookingId: b._id,
    bookingReference: b.bookingReference,
    guestName: `${b.primaryGuest.firstName} ${b.primaryGuest.lastName}`,
    room: `${b.roomTypeId?.name || ""} ${b.roomNumber || ""}`,
    pricePerNight: b.pricePerNight,
    nights: b.nights,
    totalAmount: b.totalAmount,
    paymentStatus: b.paymentStatus,
  }));

  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    count: data.length,
    data,
  };
};

// vendor invocie download
// exports.generateInvoicePdf = async (bookingId, vendorId, res) => {
//   if (!mongoose.Types.ObjectId.isValid(bookingId)) {
//     throw new Error("Invalid booking id");
//   }

//   const booking = await Booking.findById(bookingId)
//     .populate("roomTypeId", "name")
//     .lean();

//   if (!booking) throw new Error("Booking not found");

//   const hotel = await Hotel.findOne({
//     _id: booking.hotelId,
//     vendorId,
//   }).lean();

//   if (!hotel) {
//     throw new Error("Unauthorized access");
//   }

//   // Set headers
//   res.setHeader(
//     "Content-Disposition",
//     `attachment; filename=invoice-${booking.bookingReference}.pdf`,
//   );

//   res.setHeader("Content-Type", "application/pdf");

//   // Create PDF
//   const doc = new PDFDocument({ margin: 50 });

//   doc.pipe(res);

//   // Header
//   doc.fontSize(20).text("INVOICE", { align: "center" });
//   doc.moveDown();

//   // Booking info
//   doc.fontSize(12).text(`Invoice #: ${booking.bookingReference}`);
//   doc.text(
//     `Guest: ${booking.primaryGuest.firstName} ${booking.primaryGuest.lastName}`,
//   );
//   doc.text(`Room: ${booking.roomTypeId.name} ${booking.roomNumber}`);
//   doc.text(`Check-in: ${booking.checkIn.toDateString()}`);
//   doc.text(`Check-out: ${booking.checkOut.toDateString()}`);
//   doc.text(`Nights: ${booking.nights}`);

//   doc.moveDown();

//   // Pricing
//   doc.text(`Price per night: ₹${booking.pricePerNight}`);
//   doc.text(`Tax: ₹${booking.taxAmount}`);
//   doc.text(`Cleaning Fee: ₹${booking.cleaningFee}`);
//   doc.text(`Discount: ₹${booking.discountAmount}`);

//   doc.moveDown();

//   doc.fontSize(14).text(`Total Amount: ₹${booking.totalAmount}`);

//   doc.moveDown();

//   doc.text(`Payment Status: ${booking.paymentStatus}`);

//   doc.end();
// };

exports.generateInvoicePdf = async (bookingId, vendorId, res) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new Error("Invalid booking id");
  }

  const booking = await Booking.findById(bookingId)
    .populate({
      path: "roomTypeId",
      select: "name basePrice discountPrice roomSizeSqm beds amenities",
    })
    .lean();

  if (!booking) throw new Error("Booking not found");

  const hotel = await Hotel.findOne({
    _id: booking.hotelId,
    vendorId,
  }).lean();

  if (!hotel) throw new Error("Unauthorized access");

  // Headers
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${booking.bookingReference}.pdf`,
  );
  res.setHeader("Content-Type", "application/pdf");

  const doc = new PDFDocument({ margin: 40, size: "A4" });
  doc.pipe(res);

  // COLORS & STYLES
  const primaryBlue = "#1a73e8";
  const brandRed = "#ff3838";
  const lightBg = "#f8f9fa";
  const textColor = "#333333";
  const borderColor = "#eeeeee";

  //HEADER (TRIVLLO LOGO)
  doc.circle(65, 60, 20).fill(brandRed);
  doc
    .fillColor("#000")
    .fontSize(20)
    .font("Helvetica-BoldOblique")
    .text(trivlloData.company_name, 50, 52);

  // Header Title & Booking ID
  doc
    .fillColor(textColor)
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("Hotelier Voucher", 380, 40, { align: "right" });
  doc
    .fontSize(10)
    .fillColor("gray")
    .font("Helvetica")
    .text(`BOOKING ID: ${booking.bookingReference}`, 380, 65, {
      align: "right",
    });

  doc.moveDown(2);

  //STATUS BADGE
  const statusX = 40;
  const statusY = 110;
  doc.roundedRect(statusX, statusY, 515, 35, 3).fill(lightBg);

  doc
    .fillColor(primaryBlue)
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("BOOKING STATUS:", statusX + 15, statusY + 12)
    .fillColor(booking.status === "Confirmed" ? "#f5a623" : "orange") // Orange/Amber
    .text(booking.status.toUpperCase(), statusX + 115, statusY + 12);

  doc
    .fillColor(primaryBlue)
    .text("PAYMENT:", statusX + 280, statusY + 12)
    .fillColor(textColor)
    .text(booking.paymentStatus.toUpperCase(), statusX + 340, statusY + 12);

  //PROPERTY & GUEST GRID
  doc.moveDown(3.5);
  const gridY = doc.y;

  // Left: Hotel
  doc
    .fillColor(primaryBlue)
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(hotel.name, 40, gridY);
  doc
    .fillColor("#666")
    .fontSize(9)
    .font("Helvetica")
    .text(`${hotel.address}, ${hotel.city}`, 40, gridY + 15, { width: 220 });

  // Right: Guest
  doc
    .fillColor(primaryBlue)
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("PRIMARY GUEST", 320, gridY);
  doc
    .fillColor(textColor)
    .fontSize(10)
    .font("Helvetica")
    .text(
      `${booking.primaryGuest.firstName} ${booking.primaryGuest.lastName}`,
      320,
      gridY + 15,
    )
    .fillColor("#666")
    .fontSize(9)
    .text(booking.primaryGuest.email)
    .text(booking.primaryGuest.phoneNumber);

  //CHECK-IN/OUT BOX
  doc.moveDown(5);
  const boxY = doc.y;
  doc.roundedRect(40, boxY, 515, 65, 3).stroke(borderColor);
  doc
    .moveTo(297, boxY)
    .lineTo(297, boxY + 65)
    .stroke(borderColor);

  // Check-In
  doc
    .fillColor("gray")
    .fontSize(8)
    .text("CHECK-IN", 55, boxY + 10);
  doc
    .fillColor(textColor)
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(booking.checkIn.toDateString(), 55, boxY + 25);
  doc
    .fontSize(9)
    .font("Helvetica")
    .text("03:00 PM", 55, boxY + 45);

  // Check-Out
  doc
    .fillColor("gray")
    .fontSize(8)
    .text("CHECK-OUT", 312, boxY + 10);
  doc
    .fillColor(textColor)
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(booking.checkOut.toDateString(), 312, boxY + 25);
  doc
    .fontSize(9)
    .font("Helvetica")
    .text("11:00 AM", 312, boxY + 45);

  //ROOM DETAILS (WITH SPECS & AMENITIES)
  doc.moveDown(6);
  const tableTop = doc.y;
  doc
    .fillColor(primaryBlue)
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("ROOM DETAILS", 40, tableTop);

  const headerY = tableTop + 20;
  doc.rect(40, headerY, 515, 20).fill(lightBg);
  doc
    .fillColor(textColor)
    .fontSize(9)
    .font("Helvetica-Bold")
    .text("ROOM TYPE & SPECS", 50, headerY + 6)
    .text("CAPACITY", 250, headerY + 6)
    .text("TOTAL", 480, headerY + 6, { align: "right" });

  const rt = booking.roomTypeId;
  const rowY = headerY + 25;

  //Name & Specs (Beds/Size)
  doc
    .fillColor(textColor)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(rt.name, 50, rowY);
  const bedInfo = rt.beds.map((b) => `${b.quantity} ${b.type}`).join(", ");
  doc
    .fillColor("#666")
    .fontSize(9)
    .font("Helvetica")
    .text(`${bedInfo} | ${rt.roomSizeSqm} m²`, 50, rowY + 15);

  // Amenities bar
  const amenitiesTxt = rt.amenities.slice(0, 4).join(" • ");
  doc
    .fillColor(primaryBlue)
    .fontSize(8)
    .text(amenitiesTxt, 50, rowY + 30);

  doc
    .fillColor(textColor)
    .fontSize(10)
    .text(`${booking.guests.adults}A + ${booking.guests.children}C`, 250, rowY);
  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(`Rs. ${booking.totalAmount}`, 480, rowY, { align: "right" });

  doc
    .moveTo(40, rowY + 45)
    .lineTo(555, rowY + 45)
    .stroke(borderColor);

  //FINAL PRICE BREAKDOWN
  doc.moveDown(4.5);
  const calcX = 350;
  const valueX = 555;

  //Logic
  const baseTotal = rt.basePrice * booking.nights;
  const discountAmt = (rt.basePrice - rt.discountPrice) * booking.nights;
  const discountPercent = Math.round(
    ((rt.basePrice - rt.discountPrice) / rt.basePrice) * 100,
  );

  const drawPriceRow = (label, value, isTotal = false, isDisc = false) => {
    const currentY = doc.y;
    doc
      .font(isTotal ? "Helvetica-Bold" : "Helvetica")
      .fontSize(isTotal ? 12 : 10)
      .fillColor(isDisc ? brandRed : isTotal ? primaryBlue : textColor);

    // Label drawing
    doc.text(label, calcX, currentY);

    doc.text(`Rs. ${value}`, calcX, currentY, {
      width: valueX - calcX,
      align: "right",
    });

    doc.moveDown(1.2);
  };

  //Row execution
  drawPriceRow("Base Price (Original)", baseTotal.toFixed(2));

  if (discountAmt > 0) {
    drawPriceRow(
      `Discount (${discountPercent}% OFF)`,
      `-${discountAmt.toFixed(2)}`,
      false,
      true,
    );
  }

  drawPriceRow(
    "Taxes & Fees",
    (booking.totalTax || booking.taxAmount).toFixed(2),
  );

  doc.moveTo(calcX, doc.y).lineTo(valueX, doc.y).stroke(borderColor);
  doc.moveDown(0.5);

  // Grand Total
  drawPriceRow("GRAND TOTAL", booking.totalAmount.toFixed(2), true);

  //FOOTER
  doc
    .fontSize(8)
    .fillColor("gray")
    .text(`Thank you for booking with ${trivlloData.company_name}! Have a great stay.`, 40, 760, {
      align: "center",
    })
    .text("Carry a valid Govt. ID (Aadhar/Passport) for check-in.", {
      align: "center",
    });

  doc.end();
};

exports.getVendorDashboard = async (
  vendorId,
  reservationDays = 7,
  revenueMonths = 6,
) => {
  const hotels = await Hotel.find({ vendorId }, "_id").lean();
  const hotelIds = hotels.map((h) => h._id);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const lastDays = new Date(today);
  lastDays.setDate(today.getDate() - (reservationDays - 1));

  const lastMonths = new Date(
    today.getFullYear(),
    today.getMonth() - (revenueMonths - 1),
    1,
  );

  const [
    newBookings,
    todayCheckIns,
    todayCheckOuts,
    totalRevenueAgg,
    totalRooms,
    occupiedRooms,
    revenueAgg,
    reservationAgg,
    recentBookings,
  ] = await Promise.all([
    Booking.countDocuments({
      hotelId: { $in: hotelIds },
      createdAt: { $gte: today },
    }),

    Booking.countDocuments({
      hotelId: { $in: hotelIds },
      checkIn: { $gte: today, $lt: tomorrow },
    }),

    Booking.countDocuments({
      hotelId: { $in: hotelIds },
      checkOut: { $gte: today, $lt: tomorrow },
    }),

    Booking.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          paymentStatus: "paid",
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]),

    Room.countDocuments({
      hotelId: { $in: hotelIds },
    }),

    Booking.countDocuments({
      hotelId: { $in: hotelIds },
      status: { $in: ["checked_in", "staying"] },
    }),

    Booking.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          paymentStatus: "paid",
          createdAt: { $gte: lastMonths },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
        },
      },
    ]),

    Booking.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          createdAt: { $gte: lastDays },
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
          },
          booked: {
            $sum: {
              $cond: [{ $ne: ["$status", "cancelled"] }, 1, 0],
            },
          },
          cancelled: {
            $sum: {
              $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0],
            },
          },
        },
      },
    ]),

    Booking.find({
      hotelId: { $in: hotelIds },
      checkIn: { $lte: today },
      checkOut: { $gte: today },
      status: { $in: ["confirmed", "checked_in", "staying"] },
    })
      .select(
        "bookingReference primaryGuest roomTypeId roomNumber checkIn checkOut status",
      )
      .populate("roomTypeId", "name")
      .sort({ checkIn: 1 })
      .limit(10)
      .lean(),
  ]);

  const totalRevenue = totalRevenueAgg[0]?.total || 0;
  const availableRooms = totalRooms - occupiedRooms;

  //Revenue Chart
  const revenueMap = new Map();

  revenueAgg.forEach((r) => {
    revenueMap.set(`${r._id.year}-${r._id.month}`, r.revenue);
  });

  const revenueChart = [];

  for (let i = 0; i < revenueMonths; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;

    revenueChart.unshift({
      month: d.toLocaleString("default", { month: "short" }),
      revenue: revenueMap.get(key) || 0,
    });
  }

  //Reservation Chart
  const reservationMap = new Map();

  reservationAgg.forEach((r) => {
    reservationMap.set(r._id.date, r);
  });

  const reservationChart = [];

  for (let i = 0; i < reservationDays; i++) {
    const d = new Date(lastDays);
    d.setDate(lastDays.getDate() + i);

    const key = d.toISOString().split("T")[0];
    const found = reservationMap.get(key);

    reservationChart.push({
      date: d.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      booked: found ? found.booked : 0,
      cancelled: found ? found.cancelled : 0,
    });
  }

  //Recent Bookings formating
  const formattedRecent = recentBookings.map((b) => ({
    bookingReference: b.bookingReference,
    guestName: `${b.primaryGuest.firstName} ${b.primaryGuest.lastName}`,
    room: `${b.roomTypeId?.name || ""} ${b.roomNumber || ""}`,
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    status: b.status,
  }));

  return {
    stats: {
      newBookings,
      todayCheckIns,
      todayCheckOuts,
      totalRevenue,
    },

    roomSummary: {
      totalRooms,
      occupiedRooms,
      availableRooms,
    },

    revenueChart,

    reservationChart,

    recentBookings: formattedRecent,
  };
};

//helper function
const validateOwnership = async (bookingId, vendorId) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new Error("Invalid booking id");
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  const hotel = await Hotel.findOne({
    _id: booking.hotelId,
    vendorId,
  });

  if (!hotel) throw new Error("Unauthorized access");

  return booking;
};

exports.checkInBooking = async (bookingId, vendorId) => {
  const booking = await validateOwnership(bookingId, vendorId);

  if (booking.status !== "confirmed") {
    throw new Error("Only confirmed bookings can be checked in");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (booking.checkIn > today) {
    throw new Error("Cannot check in before check-in date");
  }

  booking.status = "checked_in";
  booking.actualCheckInAt = new Date();

  await booking.save();

  return booking;
};

exports.markBookingStaying = async (bookingId, vendorId) => {
  const booking = await validateOwnership(bookingId, vendorId);

  if (booking.status !== "checked_in") {
    throw new Error("Guest must be checked in first");
  }

  booking.status = "staying";
  await booking.save();

  return booking;
};

exports.checkOutBooking = async (bookingId, vendorId) => {
  const booking = await validateOwnership(bookingId, vendorId);

  if (!["checked_in", "staying"].includes(booking.status)) {
    throw new Error("Booking not eligible for checkout");
  }

  booking.status = "checked_out";
  booking.actualCheckOutAt = new Date();

  await booking.save();

  return booking;
};
