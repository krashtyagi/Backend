const mongoose = require("mongoose");
const crypto = require("crypto");
const razorpay = require("../../shared/config/razorpay");
const Booking = require("../bookings/booking.model");
const Payment = require("./payment.model");
const Availability = require("../availability/availability.model");
const Hotel = require("../hotels/hotel.model");
const RoomType = require("../rooms/roomType.model");
const logger = require("../../shared/utils/logger");
const {
  sendBookingConfirmationEmail,
} = require("../../shared/utils/sendEmail");

// exports.verifyPayment = async (data) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       throw new Error("Missing payment verification data");
//     }

//     const payment = await Payment.findOne({
//       razorpayOrderId: razorpay_order_id,
//     }).session(session);

//     if (!payment) throw new Error("Payment record not found");

//     // Idempotency check
//     if (payment.isVerified && payment.status === "captured") {
//       const existingBooking = await Booking.findById(payment.bookingId).session(
//         session,
//       );
//       await session.commitTransaction();
//       session.endSession();
//       return existingBooking;
//     }

//     if (payment.status !== "created") {
//       throw new Error("Invalid payment state");
//     }

//     // Signature verification
//     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       throw new Error("Invalid payment signature");
//     }

//     payment.razorpayPaymentId = razorpay_payment_id;
//     payment.razorpaySignature = razorpay_signature;
//     payment.status = "captured";
//     payment.isVerified = true;
//     payment.expiresAt = undefined;

//     await payment.save({ session });

//     const booking = await Booking.findById(payment.bookingId).session(session);
//     if (!booking) throw new Error("Booking not found");

//     if (booking.status !== "pending") {
//       throw new Error("Invalid booking state");
//     }

//     // amount validation (WITH TAX)
//     if (payment.amountPaid !== booking.totalAmount) {
//       throw new Error("Payment amount mismatch");
//     }

//     const hotel = await Hotel.findById(booking.hotelId).session(session);
//     if (!hotel || !hotel.isActive) {
//       throw new Error("Hotel no longer available");
//     }

//     const roomTypeData = await RoomType.findById(booking.roomTypeId).session(
//       session,
//     );
//     if (!roomTypeData) {
//       throw new Error("Room type not found");
//     }

//     const startDate = new Date(booking.checkIn);

//     //INVENTORY LOCK
//     for (let i = 0; i < booking.nights; i++) {
//       const currentDate = new Date(startDate.getTime() + i * 86400000);

//       currentDate.setHours(0, 0, 0, 0);

//       const existingDoc = await Availability.findOne({
//         roomTypeId: booking.roomTypeId,
//         date: currentDate,
//       }).session(session);

//       if (existingDoc) {
//         const available =
//           roomTypeData.totalRooms -
//           existingDoc.bookedRooms -
//           existingDoc.blockedRooms;

//         if (available < booking.roomsBooked) {
//           throw new Error(
//             `Rooms just sold out for ${currentDate.toDateString()}`,
//           );
//         }

//         await Availability.updateOne(
//           { _id: existingDoc._id },
//           { $inc: { bookedRooms: booking.roomsBooked } },
//           { session },
//         );
//       } else {
//         if (booking.roomsBooked > roomTypeData.totalRooms) {
//           throw new Error(
//             `Rooms just sold out for ${currentDate.toDateString()}`,
//           );
//         }

//         await Availability.create(
//           [
//             {
//               roomTypeId: booking.roomTypeId,
//               date: currentDate,
//               bookedRooms: booking.roomsBooked,
//               blockedRooms: 0,
//             },
//           ],
//           { session },
//         );
//       }
//     }

// booking.status = "confirmed";
// booking.paymentStatus = "paid";
// booking.expiresAt = undefined;

// await booking.save({ session });

//     await session.commitTransaction();
//     session.endSession();

//     // Send confirmation email
//     try {
//       await sendBookingConfirmationEmail(booking.primaryGuest.email, {
//         customerName: booking.primaryGuest.firstName,
//         bookingId: booking.bookingReference,
//         hotelName: hotel.name,
//         roomName: roomTypeData.name,
//         checkIn: booking.checkIn,
//         checkOut: booking.checkOut,
//         amount: booking.totalAmount,
//       });
//     } catch (mailErr) {
//       logger.error("Booking Confirmation Email failed:", mailErr);
//     }

//     return booking;
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     logger.error("Service Error: verifyPayment", err);
//     throw err;
//   }
// };

exports.verifyPayment = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error("Missing payment verification data");
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    }).session(session);

    if (!payment) throw new Error("Payment record not found");

    // Idempotency check
    if (payment.isVerified && payment.status === "captured") {
      const existingBooking = await Booking.findById(payment.bookingId).session(
        session,
      );
      await session.commitTransaction();
      session.endSession();
      return existingBooking;
    }

    if (payment.status !== "created") {
      throw new Error("Invalid payment state");
    }

    // EXPIRY CHECK (Payment)
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

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "captured";
    payment.isVerified = true;
    payment.paymentMethod = razorpayPayment.method || "unknown";
    payment.expiresAt = undefined;

    await payment.save({ session });

    const booking = await Booking.findById(payment.bookingId).session(session);
    if (!booking) throw new Error("Booking not found");

    //expiry check
    if (booking.expiresAt && booking.expiresAt < new Date()) {
      throw new Error("Booking expired. Please create a new booking.");
    }

    if (booking.status !== "pending") {
      throw new Error("Invalid booking state");
    }

    if (payment.amountPaid !== booking.totalAmount) {
      throw new Error("Payment amount mismatch");
    }

    //Validate hotel + room
    const hotel = await Hotel.findById(booking.hotelId).session(session);
    if (!hotel || !hotel.isActive) {
      throw new Error("Hotel no longer available");
    }

    const roomTypeData = await RoomType.findById(booking.roomTypeId).session(
      session,
    );
    if (!roomTypeData) {
      throw new Error("Room type not found");
    }

    const startDate = new Date(booking.checkIn);

    //INVENTORY LOCK
    for (let i = 0; i < booking.nights; i++) {
      const currentDate = new Date(startDate.getTime() + i * 86400000);
      currentDate.setHours(0, 0, 0, 0);

      const existingDoc = await Availability.findOne({
        roomTypeId: booking.roomTypeId,
        date: currentDate,
      }).session(session);

      if (existingDoc) {
        const available =
          roomTypeData.totalRooms -
          existingDoc.bookedRooms -
          existingDoc.blockedRooms;

        if (available < booking.roomsBooked) {
          throw new Error(
            `Rooms just sold out for ${currentDate.toDateString()}`,
          );
        }

        await Availability.updateOne(
          { _id: existingDoc._id },
          { $inc: { bookedRooms: booking.roomsBooked } },
          { session },
        );
      } else {
        if (booking.roomsBooked > roomTypeData.totalRooms) {
          throw new Error(
            `Rooms just sold out for ${currentDate.toDateString()}`,
          );
        }

        await Availability.create(
          [
            {
              roomTypeId: booking.roomTypeId,
              date: currentDate,
              bookedRooms: booking.roomsBooked,
              blockedRooms: 0,
            },
          ],
          { session },
        );
      }
    }

    // const updatedBooking = await Booking.findOneAndUpdate(
    //   {
    //     _id: booking._id,
    //     status: "pending",
    //     expiresAt: { $gt: new Date() },
    //   },
    //   {
    //     status: "confirmed",
    //     paymentStatus: "paid",
    //     expiresAt: undefined,
    //   },
    //   { new: true, session },
    // );

    // if (!updatedBooking) {
    //   throw new Error("Booking expired or already processed");
    // }

    booking.status = "confirmed";
    booking.paymentStatus = "paid";
    booking.expiresAt = undefined;

    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    try {
      await sendBookingConfirmationEmail(booking.primaryGuest.email, {
        customerName: booking.primaryGuest.firstName,
        bookingId: booking.bookingReference,
        hotelName: hotel.name,
        roomName: roomTypeData.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        amount: booking.totalAmount,
      });
    } catch (mailErr) {
      logger.error("Booking Confirmation Email failed:", mailErr);
    }

    return booking;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    logger.error("Service Error: verifyPayment", err);
    throw err;
  }
};
