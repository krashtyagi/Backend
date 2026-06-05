const mongoose = require("mongoose");

const cabCompanySchema = new mongoose.Schema(
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
      trim: true,
    },

    location: {
      city: {
        type: String,
        required: true,
      },
      state: String,
      country: {
        type: String,
        default: "India",
      },
    },

    address: String,

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

    description: String,

    features: [String],

    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
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

cabCompanySchema.index({ name: "text", description: "text" });
cabCompanySchema.index({ "location.city": 1, isActive: 1 });
cabCompanySchema.index({ vendorId: 1, createdAt: -1 });

module.exports = mongoose.model("CabCompany", cabCompanySchema);
