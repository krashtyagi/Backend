const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.ObjectId,
      ref: "Hotel",
      required: true,
    },

    roomTypeId: {
      type: mongoose.Schema.ObjectId,
      ref: "RoomType",
      required: true,
    },

    roomNumber: {
      type: String,
      required: true,
    },
    floor: Number,

    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },

    accessibility: {
      wheelchairAccessible: Boolean,
      grabBars: Boolean,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Room", roomSchema);
