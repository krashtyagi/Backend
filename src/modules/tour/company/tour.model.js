const mongoose = require("mongoose");

// Deep, powerful address sub-schema
const addressSchema = new mongoose.Schema(
  {
    buildingName: { type: String, trim: true, default: "" },
    doorNumber: { type: String, trim: true, default: "" },
    streetAddress: { type: String, trim: true, default: "" },
    areaName: { type: String, trim: true, index: true, default: "" }, // Town / locality / neighborhood

    city: { type: String, required: true, trim: true, index: true },
    district: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, index: true, default: "" },
    postalCode: { type: String, trim: true, index: true, default: "" },
    country: { type: String, trim: true, default: "India", index: true },
    countryCode: { type: String, uppercase: true, trim: true, maxlength: 2, default: "IN" },

    landmark: { type: String, trim: true, default: "" },
    directions: { type: String, trim: true, default: "" },

    formattedAddress: { type: String, trim: true, default: "" },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [72.8777, 19.0760], // [lng, lat]
      },
    },

    placeId: { type: String, trim: true, default: "" },
    timeZone: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const tourCompanySchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Tour company name is required"],
      trim: true,
      index: true,
    },

    location: {
      city: {
        type: String,
        required: true,
        index: true,
        trim: true,
      },
      state: { type: String, trim: true },
      country: {
        type: String,
        default: "India",
        trim: true,
      },
    },

    // Embedded Powerful Address Schema (or string for legacy compatibility)
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

    logo: {
      url: String,
      public_id: String,
      resource_type: { type: String, default: "image" },
    },

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

    tags: [
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

// Pre-validation synchronization
tourCompanySchema.pre("validate", function (next) {
  if (typeof this.address === "string") {
    const raw = this.address;
    this.address = {
      streetAddress: raw,
      city: this.location?.city || "India",
      state: this.location?.state || "",
      country: this.location?.country || "India",
      formattedAddress: raw,
      location: {
        type: "Point",
        coordinates: [this.coordinates?.lng || 72.8777, this.coordinates?.lat || 19.0760],
      },
    };
  } else if (!this.address && this.location?.city) {
    this.address = {
      streetAddress: "",
      city: this.location.city,
      state: this.location.state || "",
      country: this.location.country || "India",
      formattedAddress: this.location.city,
      location: {
        type: "Point",
        coordinates: [this.coordinates?.lng || 72.8777, this.coordinates?.lat || 19.0760],
      },
    };
  }

  // Sync city, state, country
  if (this.address?.city && (!this.location || !this.location.city)) {
    if (!this.location) this.location = {};
    this.location.city = this.address.city;
  }
  if (this.location?.city && this.address && !this.address.city) {
    this.address.city = this.location.city;
  }
  if (this.address?.state && (!this.location || !this.location.state)) {
    if (!this.location) this.location = {};
    this.location.state = this.address.state;
  }
  if (this.address?.country && (!this.location || !this.location.country)) {
    if (!this.location) this.location = {};
    this.location.country = this.address.country;
  }

  // Sync coordinates
  if (this.coordinates?.lat && this.coordinates?.lng) {
    if (this.address && (!this.address.location || !this.address.location.coordinates?.length)) {
      this.address.location = {
        type: "Point",
        coordinates: [this.coordinates.lng, this.coordinates.lat],
      };
    }
  } else if (this.address?.location?.coordinates?.length === 2) {
    this.coordinates = {
      lat: this.address.location.coordinates[1],
      lng: this.address.location.coordinates[0],
    };
  }

  if (typeof next === "function") {
    next();
  }
});

tourCompanySchema.index({ "location.city": 1, isActive: 1 });
tourCompanySchema.index({ "address.city": 1, "address.areaName": 1, isActive: 1 });
tourCompanySchema.index({ vendorId: 1, createdAt: -1 });
tourCompanySchema.index({
  name: "text",
  description: "text",
  "location.city": "text",
  "address.city": "text",
  "address.areaName": "text",
  "address.district": "text",
  "address.streetAddress": "text",
});

const TourCompany = mongoose.model("TourCompany", tourCompanySchema);

module.exports = TourCompany;
module.exports.addressSchema = addressSchema;
