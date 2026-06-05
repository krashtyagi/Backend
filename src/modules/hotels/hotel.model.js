const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    images: [
      {
        url: String,
        public_id: String,
        resource_type: String,
      },
    ],

    documents: [
      {
        docName: String,
        docUrl: String,
        public_id: String,
        resource_type: String,
        isVerified: { type: Boolean, default: false },
      },
    ],
    amenities: {
      type: [String],
      default: [],
    },

    accessibility: {
      wheelchairAccessible: {
        type: Boolean,
        default: false,
      },
      grabBars: {
        type: Boolean,
        default: false,
      },
      hearingSupport: {
        type: Boolean,
        default: false,
      },
      elevator: {
        type: Boolean,
        default: false,
      },
    },

    distanceFromCenter: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },

    rank: {
      type: String,
      enum: ["A", "B", "C"],
      default: "C",
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

hotelSchema.index({ location: "2dsphere" });

hotelSchema.index(
  {
    name: "text",
    city: "text",
    description: "text",
  },
  {
    weights: {
      name: 5,
      city: 3,
      description: 1,
    },
  },
);

module.exports = mongoose.model("Hotel", hotelSchema);
