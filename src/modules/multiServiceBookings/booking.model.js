const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    age: { type: Number },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    weight: { type: Number }, // optional (adventure use)
  },
  { _id: false },
);

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      index: true,
    },

    vendorId: {
      type: mongoose.Schema.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    serviceType: {
      type: String,
      enum: ["adventure", "cab", "tour", "bike"],
      required: true,
      index: true,
    },

    serviceId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      index: true,
    },

    bookingReference: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    bookingDate: {
      type: Date,
      required: true,
      index: true,
    },

    timeSlot: {
      type: String, //adventure specific
    },

    // bike & tour specific
    duration: {
      startDate: Date,
      endDate: Date,
      totalDays: Number,
    },

    primaryCustomer: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, trim: true },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      phoneNumber: { type: String, required: true, trim: true },
    },

    //Participants (Dynamic)
    participants: {
      type: [participantSchema],
      default: [],
    },

    //Dynamic Data
    meta: {
      type: Object,
      default: {},
    },

    extraInfo: {
      type: Object,
      default: {},
    },

    //Pricing Snapshot
    pricing: {
      baseAmount: { type: Number, required: true },
      taxAmount: { type: Number, default: 0 },
      taxPercentage: { type: Number, default: 0 },

      discountAmount: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
    },

    serviceSnapshot: {
      title: { type: String },
      type: { type: String },
      price: { type: Number },
      vendorId: { type: mongoose.Schema.ObjectId },

      extra: {
        type: Object,
        default: {},
      },
    },

    // quantity meaning:
    // adventure → participants
    // bike → days
    // tour → people
    // cab → 1
    quantity: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },

    paymentId: {
      type: mongoose.Schema.ObjectId,
      ref: "Payment",
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

    specialRequest: {
      type: String,
      trim: true,
    },

    cancelledAt: Date,
    cancellationReason: { type: String, trim: true },

    expiresAt: {
      type: Date,
      index: { expires: "0s" },
    },
  },
  { timestamps: true },
);

bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ vendorId: 1, createdAt: -1 });
bookingSchema.index({ serviceId: 1, serviceType: 1 });
bookingSchema.index({ bookingDate: 1, status: 1 });
bookingSchema.index({ paymentStatus: 1, status: 1 });
bookingSchema.index({ bookingReference: 1 });

module.exports = mongoose.model("GenericBooking", bookingSchema);
