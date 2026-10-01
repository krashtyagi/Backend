const mongoose = require("mongoose");

const deletedPropertySchema = new mongoose.Schema(
  {
    originalVendorId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    propertyId: {
      type: String,
      default: "",
      index: true,
    },
    propertyName: {
      type: String,
      default: "Unnamed Property",
      trim: true,
    },
    businessName: {
      type: String,
      default: "N/A",
      trim: true,
    },
    vendorName: {
      type: String,
      default: "N/A",
      trim: true,
    },
    vendorEmail: {
      type: String,
      default: "",
      trim: true,
    },
    vendorPhone: {
      type: String,
      default: "",
      trim: true,
    },
    serviceType: {
      type: String,
      enum: ["hotel", "tour", "cab", "bike", "adventure", "other"],
      default: "hotel",
      index: true,
    },
    city: {
      type: String,
      default: "N/A",
      trim: true,
    },
    reason: {
      type: String,
      default: "Deleted by administrator",
      trim: true,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deletedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

deletedPropertySchema.index({ deletedAt: -1 });

module.exports = mongoose.model("DeletedProperty", deletedPropertySchema);
