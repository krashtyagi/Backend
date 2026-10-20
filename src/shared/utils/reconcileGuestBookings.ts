import Booking from "../../modules/bookings/booking.model.js";
import GenericBooking from "../../modules/multiServiceBookings/booking.model.js";
import Payment from "../../modules/payments/payment.model.js";
import GenericPayment from "../../modules/multiServiceBookings/payment.model.js";
import logger from "./logger.js";

/**
 * Links all guest bookings (userId = null) to the newly authenticated user.
 * Called after successful login, signup, or OAuth callback.
 *
 * Uses the user's email to find matching bookings via primaryGuest.email / primaryCustomer.email.
 *
 * This is safe because:
 * 1. Email is verified during signup (OTP).
 * 2. Only bookings with userId=null are affected (never overwrites another user's booking).
 * 3. Runs in a non-transactional bulk update (eventual consistency is acceptable here).
 */
export const reconcileGuestBookings = async (
  userId: string | any,
  email?: string | null,
) => {
  try {
    if (!email || !userId) return;

    const normalizedEmail = email.toLowerCase().trim();
    const emailRegex = new RegExp(`^${normalizedEmail.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}$`, "i");

    // Hotel bookings — match by primaryGuest.email where userId is null
    const hotelResult = await Booking.updateMany(
      {
        userId: null,
        "primaryGuest.email": emailRegex,
        paymentStatus: "paid", // Only reconcile paid bookings
      },
      { $set: { userId } },
    );

    // Generic bookings (tour, cab, bike, adventure) — match by primaryCustomer.email
    const genericResult = await GenericBooking.updateMany(
      {
        userId: null,
        "primaryCustomer.email": emailRegex,
        paymentStatus: "paid",
      },
      { $set: { userId } },
    );

    // Hotel payments — link payment records to the user
    if (hotelResult.modifiedCount > 0) {
      const reconciledBookingIds = await Booking.find(
        { userId, "primaryGuest.email": normalizedEmail },
        "_id",
      ).lean();

      await Payment.updateMany(
        {
          bookingId: { $in: reconciledBookingIds.map((b) => b._id) },
          userId: null,
        },
        { $set: { userId } },
      );
    }

    // Generic payments — link payment records to the user
    if (genericResult.modifiedCount > 0) {
      const reconciledGenericIds = await GenericBooking.find(
        { userId, "primaryCustomer.email": normalizedEmail },
        "_id",
      ).lean();

      await GenericPayment.updateMany(
        {
          bookingId: { $in: reconciledGenericIds.map((b) => b._id) },
          userId: null,
        },
        { $set: { userId } },
      );
    }

    const total = hotelResult.modifiedCount + genericResult.modifiedCount;
    if (total > 0) {
      logger.info(
        `Reconciled ${total} guest booking(s) for user ${userId} (${normalizedEmail})`,
      );
    }
  } catch (error) {
    // Non-blocking — don't fail the login/signup if reconciliation fails
    logger.error("Guest booking reconciliation error:", error);
  }
};
