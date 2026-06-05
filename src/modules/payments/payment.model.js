const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    razorpayOrderId: {
      type: String,
      required: true,
    },

    razorpayPaymentId: {
      type: String,
    },

    razorpaySignature: {
      type: String,
    },

    amountPaid: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", "unknown"],
      default: "unknown",
    },

    status: {
      type: String,
      enum: [
        "created",
        "authorized",
        "captured",
        "failed",
        "refunded",
        "partially_refunded",
      ],
      default: "created",
      index: true,
    },

    refundAmount: {
      type: Number,
      default: 0,
    },

    razorpayRefundId: {
      type: String,
    },

    refundStatus: {
      type: String,
      enum: ["none", "initiated", "pending", "processed", "failed"],
      default: "none",
    },

    refundedAt: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },

    metadata: {
      type: Object, 
    },

    expiresAt: {
      type: Date,
      index: { expires: "0s" },
    },
    
  },
  { timestamps: true }
);

paymentSchema.index({ razorpayPaymentId: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ bookingId: 1, status: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
