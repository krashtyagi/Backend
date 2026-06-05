const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.ObjectId,
      ref: "Booking",
      required: true,
    },

    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    gateway: {
      type: String,
      enum: ["razorpay"],
      default: "razorpay",
    },

    gatewayOrderId: {
      type: String,
      required: true,
      unique: true,
    },

    gatewayPaymentId: {
      type: String,
      index: true,
    },

    gatewaySignature: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["created", "authorized", "captured", "failed", "refunded"],
      default: "created",
    },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", "unknown"],
      default: "unknown",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    refundAmount: {
      type: Number,
      default: 0,
    },

    refundStatus: {
      type: String,
      enum: ["none", "pending", "processed", "failed"],
      default: "none",
    },

    refundedAt: Date,
    metadata: {
      serviceType: String,
      bookingReference: String,
      extra: {
        type: Object,
        default: {},
      },
    },
    expiresAt: {
      type: Date,
      index: { expires: "0s" },
    },
  },
  { timestamps: true },
);

paymentSchema.index({ bookingId: 1, status: 1 });

paymentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("GenericPayment", paymentSchema);
