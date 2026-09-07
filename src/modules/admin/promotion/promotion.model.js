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
      enum: ["Boost", "Premium", "Elite", "Admin", "Direct"],
      default: "Admin",
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
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
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

promotionSchema.index({ vendorId: 1, status: 1 });
promotionSchema.index({ serviceId: 1, status: 1 });

const Promotion = mongoose.model("Promotion", promotionSchema);

module.exports = Promotion;
