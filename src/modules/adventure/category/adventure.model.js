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
      type: mongoose.Schema.Types.Mixed,
    },

    coordinates: {
      lat: Number,
      lng: Number,
    },

    locationHistory: [
      {
        address: { type: mongoose.Schema.Types.Mixed },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        coordinates: {
          lat: Number,
          lng: Number,
        },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    images: [
      {
        url: String,
        public_id: String,
        resource_type: String,
      },
    ],

    advertisementImage: {
      url: String,
      public_id: String,
      resource_type: { type: String, default: "image" },
    },

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
      enum: ["A", "B", "C", null],
      default: null,
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
