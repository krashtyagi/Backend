const mongoose = require("mongoose");

const vendorAccountGroupSchema = new mongoose.Schema(
  {
    accounts: [
      {
        vendorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Vendor",
          required: true,
        },

        serviceType: {
          type: String,

          enum: ["hotel", "adventure", "cab", "bike", "tour"],
        },

        linkedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    primaryVendorId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Vendor",

      required: true,
    },
  },
  {
    timestamps: true,
  },
);

vendorAccountGroupSchema.index({
  "accounts.vendorId": 1,
});

module.exports = mongoose.model("VendorAccountGroup", vendorAccountGroupSchema);
