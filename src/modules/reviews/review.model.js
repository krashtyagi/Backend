const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    bookingId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      unique: true,
    },

    companyId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    companyType: {
      type: String,
      enum: ["hotel", "adventure", "tour", "cab", "bike"],
      required: true,
    },

    vendorId: {
      type: mongoose.Schema.ObjectId,
      ref: "Vendor",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    vendorReply: {
      message: {
        type: String,
        trim: true,
        maxlength: 1000,
      },
      repliedAt: Date,
    },

    isFlagged: {
      type: Boolean,
      default: false,
    },

    flagReason: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

reviewSchema.index({ bookingId: 1 }, { unique: true });

reviewSchema.index({
  companyType: 1,
  companyId: 1,
});

module.exports = mongoose.model("Review", reviewSchema);
