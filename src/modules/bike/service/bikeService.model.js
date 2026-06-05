const mongoose = require("mongoose");

const bikeServiceSchema = new mongoose.Schema(
  {
    bike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BikeCompany",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    bikeName: {
      type: String,
      required: true,
      trim: true,
    },

    bikeType: {
      type: String,
      enum: ["scooter", "cruiser", "sports", "standard"],
      required: true,
    },

    engineCC: Number,

    fuelType: {
      type: String,
      enum: ["petrol", "electric"],
      default: "petrol",
    },

    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxDurationDays: {
      type: Number,
      default: 7,
    },

    description: {
      type: String,
      trim: true,
    },

    features: [String],
    images: [
      {
        url: String,
        public_id: String,
        resource_type: String,
      },
    ],
    meta: {
      mileage: String,
      gearType: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

bikeServiceSchema.index({ bike: 1, isActive: 1 });
bikeServiceSchema.index({ bikeType: 1, pricePerDay: 1 });

const BikeService = mongoose.model("BikeService", bikeServiceSchema);

module.exports = BikeService;
