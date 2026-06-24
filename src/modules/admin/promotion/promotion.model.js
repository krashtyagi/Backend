const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Promotion must be linked to a Vendor"],
      index: true,
    },
    serviceType: {
      type: String,
      enum: ["hotel", "cab", "bike", "tour", "adventure"],
      required: true,
      index: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ["Boost", "Premium", "Elite"],
      required: [true, "Plan is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    rankAssigned: {
      type: String,
      enum: ["A", "B", "C"],
      default: null,
    },
    approvedAt: {
      type: Date,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Promotion = mongoose.model("Promotion", promotionSchema);

module.exports = Promotion;
