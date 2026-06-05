const mongoose = require("mongoose");

const taxSchema = new mongoose.Schema(
  {
    taxPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // superadmin
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// 🔥 Ensure only one active tax config at a time
taxSchema.index({ isActive: 1 });

module.exports = mongoose.model("Tax", taxSchema);