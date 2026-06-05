const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../../shared/utils/encryption");

const vendorBankSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      unique: false,
    },

    accountHolderName: {
      type: String,
      required: true,
      trim: true,
    },

    bankName: {
      type: String,
      required: true,
      trim: true,
    },

    accountNumber: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },

    ifscCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      select: false,
    },

    branchName: {
      type: String,
      trim: true,
    },

    upiId: {
      type: String,
      trim: true,
      select: false,
    },

    bankProof: {
      url: String,
      public_id: String,
      resource_type: String,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true,
    },

    adminRemark: {
      type: String,
      trim: true,
    },

    isPrimary: {
      type: Boolean,
      default: true,
    },
    
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Encrypt sensitive fields before saving
vendorBankSchema.pre("save", function () {
  if (this.isModified("accountNumber") && this.accountNumber) {
    this.accountNumber = encrypt(this.accountNumber);
  }

  if (this.isModified("ifscCode") && this.ifscCode) {
    this.ifscCode = encrypt(this.ifscCode);
  }

  if (this.isModified("upiId") && this.upiId) {
    this.upiId = encrypt(this.upiId);
  }
});

// Decrypt after findOne
vendorBankSchema.post("findOne", function (doc) {
  if (!doc) return;

  if (doc.accountNumber) {
    doc.accountNumber = decrypt(doc.accountNumber);
  }

  if (doc.ifscCode) {
    doc.ifscCode = decrypt(doc.ifscCode);
  }

  if (doc.upiId) {
    doc.upiId = decrypt(doc.upiId);
  }
});

// Decrypt after find
vendorBankSchema.post("find", function (docs) {
  docs.forEach((doc) => {
    if (doc.accountNumber) {
      doc.accountNumber = decrypt(doc.accountNumber);
    }

    if (doc.ifscCode) {
      doc.ifscCode = decrypt(doc.ifscCode);
    }

    if (doc.upiId) {
      doc.upiId = decrypt(doc.upiId);
    }
  });
});

module.exports = mongoose.model("VendorBank", vendorBankSchema);
