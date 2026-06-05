const Booking = require("../../multiServiceBookings/booking.model");
const PDFDocument = require("pdfkit");

exports.getVendorInvoiceList = async (query = {}, vendor) => {
  try {
    const {
      status, // paymentStatus
      search,
      fromDate,
      toDate,
      page = 1,
      limit = 10,
    } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const filter = {
      vendorId: vendor._id,
      serviceType: vendor.serviceType,
      paymentStatus: { $in: ["paid", "refunded"] },
    };

    if (status) {
      filter.paymentStatus = status;
    }

    if (fromDate || toDate) {
      filter.bookingDate = {};

      if (fromDate) {
        filter.bookingDate.$gte = new Date(fromDate);
      }

      if (toDate) {
        filter.bookingDate.$lte = new Date(toDate);
      }
    }

    if (search) {
      filter.$or = [
        { bookingReference: { $regex: search, $options: "i" } },
        { "primaryCustomer.firstName": { $regex: search, $options: "i" } },
        { "primaryCustomer.lastName": { $regex: search, $options: "i" } },
      ];
    }

    const invoices = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select(
        "bookingReference serviceType bookingDate extraInfo pricing.totalAmount paymentStatus primaryCustomer serviceSnapshot duration quantity",
      )
      .lean();

    const total = await Booking.countDocuments(filter);

    //MULTI-SERVICE FORMAT
    const formatted = invoices.map((b) => {
      let serviceDetails = "";

      if (b.serviceType === "adventure") {
        serviceDetails = `${b.quantity} Person`;
      }

      if (b.serviceType === "cab") {
        serviceDetails = b.extraInfo?.value || "Route N/A";
      }

      if (b.serviceType === "bike") {
        serviceDetails = `${b.duration?.totalDays || 1} Days`;
      }

      if (b.serviceType === "tour") {
        serviceDetails = `${b.quantity} Person • ${
          b.duration?.totalDays || 0
        } Days`;
      }

      return {
        bookingId: b._id,
        bookingReference: b.bookingReference,

        customerName: `${b.primaryCustomer.firstName} ${
          b.primaryCustomer.lastName || ""
        }`,

        serviceTitle: b.serviceSnapshot?.title || "N/A",
        serviceType: b.serviceType,

        serviceDetails,

        amount: b.pricing?.totalAmount || 0,
        paymentStatus: b.paymentStatus,

        bookingDate: b.bookingDate,
      };
    });

    return {
      count: formatted.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: formatted,
    };
  } catch (error) {
    throw error;
  }
};

exports.generateInvoicePdf = async (bookingId, vendor, res) => {
  try {
    const booking = await Booking.findById(bookingId).lean();

    if (!booking || booking.vendorId.toString() !== vendor._id.toString()) {
      throw new Error("Unauthorized access");
    }

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${booking.bookingReference}.pdf`,
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // HEADER
    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();

    doc.fontSize(10).text(`Booking ID: ${booking.bookingReference}`);
    doc.text(`Date: ${new Date(booking.createdAt).toDateString()}`);

    doc.moveDown();

    //CUSTOMER
    doc.fontSize(14).text("Customer Details", { underline: true });
    doc.moveDown(0.5);

    doc
      .fontSize(10)
      .text(
        `${booking.primaryCustomer.firstName} ${booking.primaryCustomer.lastName || ""}`,
      );
    doc.text(booking.primaryCustomer.email);
    doc.text(booking.primaryCustomer.phoneNumber);

    doc.moveDown();

    // SERVICE DETAILS (MULTI-SERVICE)
    doc.fontSize(14).text("Service Details", { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(10).text(`Service: ${booking.serviceSnapshot?.title}`);
    doc.text(`Type: ${booking.serviceType}`);

    //SERVICE-SPECIFIC BLOCK
    if (booking.serviceType === "adventure") {
      doc.text(`Participants: ${booking.quantity}`);
      if (booking.timeSlot) doc.text(`Time Slot: ${booking.timeSlot}`);
    }

    if (booking.serviceType === "cab") {
      doc.text(`Route: ${booking.extraInfo?.value || "N/A"}`);
    }

    if (booking.serviceType === "bike") {
      doc.text(`Duration: ${booking.duration?.totalDays || 1} Days`);
      doc.text(`From: ${new Date(booking.duration?.startDate).toDateString()}`);
      doc.text(`To: ${new Date(booking.duration?.endDate).toDateString()}`);
    }

    if (booking.serviceType === "tour") {
      doc.text(`People: ${booking.quantity}`);
      doc.text(`Duration: ${booking.duration?.totalDays || 0} Days`);
    }

    // COMMON
    doc.text(`Booking Date: ${new Date(booking.bookingDate).toDateString()}`);

    // META (fallback)
    if (booking.meta && Object.keys(booking.meta).length > 0) {
      doc.moveDown(0.5);
      Object.entries(booking.meta).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`);
      });
    }

    doc.moveDown();

    //PARTICIPANTS
    if (booking.participants?.length > 0) {
      doc.fontSize(14).text("Participants", { underline: true });
      doc.moveDown(0.5);

      booking.participants.forEach((p, i) => {
        doc.fontSize(10).text(`${i + 1}. ${p.name || "N/A"}`);
        if (p.age) doc.text(`   Age: ${p.age}`);
        if (p.gender) doc.text(`   Gender: ${p.gender}`);
      });

      doc.moveDown();
    }

    //PRICING
    doc.fontSize(14).text("Pricing", { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(10).text(`Base Amount: ₹${booking.pricing.baseAmount}`);
    doc.text(
      `Tax (${booking.pricing.taxPercentage}%): ₹${booking.pricing.taxAmount}`,
    );
    doc.text(`Total Amount: ₹${booking.pricing.totalAmount}`);

    doc.moveDown();

    //PAYMENT
    doc.fontSize(14).text("Payment Details", { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(10).text(`Payment Status: ${booking.paymentStatus}`);
    doc.text(`Payment ID: ${booking.paymentId || "N/A"}`);

    doc.moveDown();

    //REFUND
    if (booking.refundStatus !== "none") {
      doc.fontSize(14).text("Refund Details", { underline: true });
      doc.moveDown(0.5);

      doc.fontSize(10).text(`Refund Status: ${booking.refundStatus}`);
      doc.text(`Refund Amount: ₹${booking.refundAmount || 0}`);

      doc.moveDown();
    }

    // FOOTER
    doc.moveDown(2);
    doc.fontSize(10).text("Thank you for your booking!", { align: "center" });

    doc.end();
  } catch (error) {
    throw error;
  }
};
