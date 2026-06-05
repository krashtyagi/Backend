const mongoose = require("mongoose");

const bikeCompanySchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Bike company name is required"],
      trim: true,
    },

    location: {
      city: {
        type: String,
        required: true,
      },
      state: { type: String },
      country: {
        type: String,
        default: "India",
      },
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

    features: [String],

    rentalPolicies: {
      helmetIncluded: { type: Boolean, default: false },
      fuelPolicy: { type: String, trim: true },
      securityDeposit: { type: Number, default: 0 },
      licenseRequired: { type: Boolean, default: true },
    },

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

bikeCompanySchema.index({ "location.city": 1, isActive: 1 });
bikeCompanySchema.index({ vendorId: 1, createdAt: -1 });

const BikeCompany = mongoose.model("BikeCompany", bikeCompanySchema);

module.exports = BikeCompany;
