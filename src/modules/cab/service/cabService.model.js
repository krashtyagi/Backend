const mongoose = require("mongoose");

const cabServiceSchema = new mongoose.Schema(
  {
    cab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CabCompany",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },

    dropLocation: {
      type: String,
      required: true,
      trim: true,
    },

    carName: {
      type: String,
      required: true,
      trim: true,
    },

    cabType: {
      type: String,
      enum: ["hatchback", "sedan", "suv", "luxury"],
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    carNumber: String,

    images: [
      {
        url: String,
        public_id: String,
        resource_type: String,
      },
    ],
    description: String,

    features: [String],

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
      },
    },

    //in vendor side use 3rd party api to calculate distance and duration
    meta: {
      distance: String, // in km
      duration: String, // in hours
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

cabServiceSchema.index({
  pickupLocation: 1,
  dropLocation: 1,
  isActive: 1,
  cabType: 1,
  basePrice: 1,
});

cabServiceSchema.index({ cab: 1, isActive: 1 });

cabServiceSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("CabService", cabServiceSchema);
