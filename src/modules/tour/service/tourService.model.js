const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    highlights: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { _id: false },
);

const tourServiceSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourCompany",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    destinations: [
      {
        type: String,
        trim: true,
      },
    ],

    duration: {
      days: {
        type: Number,
        required: true,
      },
      nights: {
        type: Number,
        required: true,
      },
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    features: [
      {
        type: String,
        trim: true,
      },
    ],

    images: [
      {
        url: String,
        public_id: String,
        resource_type: String,
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    itinerary: [itinerarySchema],

    //OPTIONAL META
    meta: {
      hotelType: { type: String }, // 3 star / 4 star
      transport: { type: String }, // cab / bus
      mealPlan: { type: String }, // MAP / AP
    },

    maxPeople: {
      type: Number,
      default: 10,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

tourServiceSchema.index({ tour: 1 });

tourServiceSchema.index({ title: "text", description: "text" });
tourServiceSchema.index({ basePrice: 1 });

tourServiceSchema.index({ isActive: 1 });

const TourService = mongoose.model("TourService", tourServiceSchema);

module.exports = TourService;
