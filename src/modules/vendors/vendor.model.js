const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vendor must be linked to a User account"],
      index: true,
    },

    // Unique 6-digit ID assigned at admin approval
    propertyId: {
      type: String,
      unique: true,
      sparse: true, 
      index: true,
    },

    linkedGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorAccountGroup",
      default: null,
      index: true,
    },

    serviceType: {
      type: String,
      enum: ["hotel", "adventure", "cab", "bike", "tour"],
      index: true,
    },

    businessName: {
      type: String,
      // required: [true, "Business name is required"],
      trim: true,
      index: true,
    },

    businessEmail: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
    },

    businessPhone: {
      type: String,
      trim: true,
      index: true,
    },

    businessAddress: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
      index: true,
    },

    state: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      default: "India",
    },

    panNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },

    aadhaarNumber: {
      type: String,
      trim: true,
    },

    // KYC Documents
    verificationDocs: [
      {
        docName: { type: String }, // aadhaarFront, aadhaarBack, panCard etc
        docUrl: { type: String },
        isVerified: { type: Boolean, default: false },
      },
    ],

    // Vendor approval flow
    status: {
      type: String,
      enum: ["draft", "pending", "under_review", "approved", "rejected"],
      default: "draft",
      index: true,
    },

    // adminRemark: {
    //   type: String,
    //   trim: true,
    // },

    // registration progress
    registrationStep: {
      type: Number,
      default: 1,
    },

    currentStep: {
      type: Number,
      default: 1,
    },

    rejectedSteps: {
      type: [Number], // multiple steps
      default: [],
    },

    rejectionReasons: {
      type: Object,
      default: {},
    },

    //timestamps for tracking
    submittedAt: Date,
    approvedAt: Date,
    rejectedAt: Date,

    isSubmitted: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

vendorSchema.index({ status: 1 });
vendorSchema.index({ serviceType: 1 });
vendorSchema.index({ city: 1 });
vendorSchema.index({ userId: 1 });
vendorSchema.index({ propertyId: 1 }, { sparse: true });

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
