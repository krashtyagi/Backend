const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      // required: [true, "Email is required"],
      // unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
      minlength: [8, "Password must be at least 8 characters"],
    },
    role: {
      type: String,
      enum: ["user", "vendor", "admin"],
      default: "user",
    },
    isVendor: {
      type: Boolean,
      default: false,
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phoneNumber: { type: String, unique: true, trim: true },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    dob: { type: Date },
    country: { type: String, default: "India" },
    avatar: { type: String },
    address: { type: String, trim: true },
    zipcCode: { type: String, trim: true },
    providers: {
      local: {
        isVerified: { type: Boolean, default: false },
      },
      google: { id: String, email: String },
      facebook: { id: String, email: String },
      apple: { id: String, email: String },
    },
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },

    otpAttempts: {
      type: Number,
      default: 0,
      select: false,
    },

    signupExpires: {
      type: Date,
      select: false,
    },

    deleteRequest: {
      status: {
        type: String,
        enum: ["none", "pending"],
        default: "none",
      },
      requestedAt: Date,
      reason: {
        type: String,
        trim: true,
      },
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Hash password before saving if modified
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    this.password = await bcrypt.hash(this.password, 12);
  } catch (error) {
    throw error;
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
