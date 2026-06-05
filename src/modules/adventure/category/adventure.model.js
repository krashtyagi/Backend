const mongoose = require("mongoose");

const adventureSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Adventure name is required"],
      trim: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["rafting", "paragliding", "bungee", "trekking"],
      index: true,
    },

    location: {
      city: {
        type: String,
        index: true,
      },
      state: { type: String },
      country: { type: String, default: "India" },
    },

    address: {
      type: String,
      trim: true,
    },

    coordinates: {
      lat: Number,
      lng: Number,
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
    description: {
      type: String,
      trim: true,
    },

    features: [
      {
        type: String,
        trim: true,
      },
    ],

    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    priceRange: {
      min: Number,
      max: Number,
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
      index: true,
    },
  },
  { timestamps: true },
);

adventureSchema.index({ category: 1, "location.city": 1 });

adventureSchema.index({ vendorId: 1, createdAt: -1 });

const Adventure = mongoose.model("Adventure", adventureSchema);

module.exports = Adventure;
