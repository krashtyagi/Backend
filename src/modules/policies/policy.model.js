const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.ObjectId,
      ref: "Hotel",
      required: true,
      unique: true,
    },

    checkInTime: String,
    checkOutTime: String,

    cancellationPolicy: String,
    prepaymentRequired: Boolean,

    childrenAllowed: Boolean,
    extraBedPolicy: String,
    ageRestriction: String,

    smokingAllowed: Boolean,
    petsAllowed: Boolean,
    quietHours: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("HotelPolicy", policySchema);
