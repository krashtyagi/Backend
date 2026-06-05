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
  },
  { _id: false },
);

const serviceSchema = new mongoose.Schema(
  {
    adventure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Adventure",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["distance", "time", "fixed", "package"],
      index: true,
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
      validate: {
        validator: function (value) {
          return value <= this.basePrice;
        },
        message: "Discount price cannot be greater than base price",
      },
    },

    meta: {
      distance: { type: String }, // "6KM"
      duration: { type: String }, // "15 min"
      days: { type: Number },
      nights: { type: Number },
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

    itinerary: [itinerarySchema], //only for trekking

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

serviceSchema.index({ adventure: 1, type: 1 });
serviceSchema.index({ adventure: 1, basePrice: 1 });
serviceSchema.index({ adventure: 1, discountPrice: 1 });

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
