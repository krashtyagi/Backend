const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    roomTypeId: {
      type: mongoose.Schema.ObjectId,
      ref: "RoomType",
      required: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    bookedRooms: {
      type: Number,
      default: 0,
      min: 0,
    },

    blockedRooms: {
      type: Number,
      default: 0,
      min: 0,
    },

    priceOverride: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true },
);

availabilitySchema.index({ roomTypeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Availability", availabilitySchema);
