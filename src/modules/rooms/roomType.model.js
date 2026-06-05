const mongoose = require("mongoose");

const roomTypeSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
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

    capacity: {
      adults: {
        type: Number,
        default: 2,
        min: 0,
      },
      children: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    beds: {
      type: [
        {
          type: {
            type: String,
            enum: ["single", "double", "king", "queen", "sofa"],
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
        },
      ],
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "At least one bed configuration is required",
      },
    },

    roomSizeSqm: {
      type: Number,
      min: 0,
    },

    viewType: {
      type: String,
      enum: ["city", "sea", "garden", "mountain", "lake","none"],
      default: "none",
    },

    amenities: [String],

    images: [
      {
        url: String,
        public_id: String,
        resource_type: String,
      },
    ],

    totalRooms: {
      type: Number,
      required: true,
      min: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("RoomType", roomTypeSchema);
