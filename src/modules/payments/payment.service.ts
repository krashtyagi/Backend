import mongoose from "mongoose";
import crypto from "crypto";
import razorpay from "../../shared/config/razorpay.js";
import Booking from "../bookings/booking.model.js";
import Payment from "./payment.model.js";
import Availability from "../availability/availability.model.js";
import Hotel from "../hotels/hotel.model.js";
import RoomType from "../rooms/roomType.model.js";
import Vendor from "../vendors/vendor.model.js";
import User from "../auth/auth.model.js";
import logger from "../../shared/utils/logger.js";
import {
  sendBookingConfirmationEmail,
  sendVendorBookingNotificationEmail,
} from "../../shared/utils/sendEmail.js";

export const verifyPayment = async (data: any) => {
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
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    const razorpayPayment: any = await razorpay.payments.fetch(razorpay_payment_id);

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "captured";
    payment.isVerified = true;
    payment.paymentMethod = razorpayPayment.method || "unknown";
    payment.expiresAt = undefined;

    await payment.save({ session });

    const booking = await Booking.findById(payment.bookingId).session(session);
    if (!booking) throw new Error("Booking not found");

    // expiry check
    if (booking.expiresAt && booking.expiresAt < new Date()) {
      throw new Error("Booking expired. Please create a new booking.");
    }

    if (booking.status !== "pending") {
      throw new Error("Invalid booking state");
    }

    if (payment.amountPaid !== booking.totalAmount) {
      throw new Error("Payment amount mismatch");
    }

    // Validate hotel + room
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

    // INVENTORY LOCK
    for (let i = 0; i < booking.nights; i++) {
      const d = new Date(startDate.getTime() + i * 86400000);
      const currentDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      const nextDate = new Date(currentDate.getTime() + 86400000);

      const existingDoc = await Availability.findOne({
        roomTypeId: booking.roomTypeId,
        date: currentDate,
      }).session(session);

      const activeBookedCount = await Booking.countDocuments({
        roomTypeId: booking.roomTypeId,
        _id: { $ne: booking._id },
        status: { $in: ["confirmed", "checked_in", "staying"] },
        checkIn: { $lt: nextDate },
        checkOut: { $gt: currentDate },
      }).session(session);

      const blockedRooms = existingDoc?.blockedRooms || 0;
      const bookedRooms = activeBookedCount;
      const available = roomTypeData.totalRooms - bookedRooms - blockedRooms;

      if (available < booking.roomsBooked) {
        throw new Error(
          `Rooms just sold out for ${d.toDateString()}`,
        );
      }

      if (existingDoc) {
        await Availability.updateOne(
          { _id: existingDoc._id },
          { $set: { bookedRooms: bookedRooms + booking.roomsBooked } },
          { session },
        );
      } else {
        await Availability.create(
          [
            {
              roomTypeId: booking.roomTypeId,
              date: currentDate,
              bookedRooms: bookedRooms + booking.roomsBooked,
              blockedRooms: 0,
            },
          ],
          { session },
        );
      }
    }

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

    try {
      const vendor = await Vendor.findById(hotel.vendorId);
      if (vendor) {
        const vendorUser = await User.findById(vendor.userId);
        const recipientEmails = [vendor.businessEmail, vendorUser?.email].filter(Boolean) as string[];
        
        await sendVendorBookingNotificationEmail(recipientEmails, {
          serviceType: "hotel",
          serviceName: hotel.name,
          bookingReference: booking.bookingReference,
          bookingDate: new Date(booking.checkIn).toLocaleDateString(),
          extraDetails: `Room Type: ${roomTypeData.name}, Nights: ${booking.nights}, Rooms Booked: ${booking.roomsBooked}`,
          totalAmount: booking.totalAmount,
          customerName: `${booking.primaryGuest.firstName} ${booking.primaryGuest.lastName}`,
          customerEmail: booking.primaryGuest.email,
          customerPhone: booking.primaryGuest.phoneNumber,
        });
      }
    } catch (vendorMailErr) {
      logger.error("Vendor Booking Notification Email failed:", vendorMailErr);
    }

    return booking;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    logger.error("Service Error: verifyPayment", err);
    throw err;
  }
};

export class PaymentService {
  async verifyPayment(data: any) {
    return verifyPayment(data);
  }
}

export const paymentService = new PaymentService();

export default paymentService;

