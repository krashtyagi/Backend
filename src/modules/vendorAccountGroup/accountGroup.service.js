const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Vendor = require("../vendors/vendor.model");
const User = require("../auth/auth.model");
const VendorAccountGroup = require("./accountGroup.model");

exports.connectVendorAccounts = async (currentVendorId, email, password) => {
  // CURRENT VENDOR
  const currentVendor = await Vendor.findById(currentVendorId);

  if (!currentVendor) {
    throw new Error("Current vendor not found");
  }

  // APPROVED CHECK
  if (currentVendor.status !== "approved") {
    throw new Error("Your vendor account is not approved yet");
  }

  // ACTIVE CHECK
  if (!currentVendor.isActive) {
    throw new Error("Inactive vendor accounts cannot be linked");
  }

  // TARGET USER
  const targetUser = await User.findOne({
    email,
  }).select("+password");

  if (!targetUser) {
    throw new Error("Account not found");
  }

  // PASSWORD VERIFY
  const isMatch = await bcrypt.compare(password, targetUser.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // TARGET VENDOR
  const targetVendor = await Vendor.findOne({
    userId: targetUser._id,
  });

  if (!targetVendor) {
    throw new Error("Vendor account not found");
  }

  // TARGET APPROVED CHECK
  if (targetVendor.status !== "approved") {
    throw new Error("Target vendor account is not approved");
  }

  // TARGET ACTIVE CHECK
  if (!targetVendor.isActive) {
    throw new Error("Inactive vendor accounts cannot be linked");
  }

  // SAME ACCOUNT CHECK
  if (currentVendor._id.toString() === targetVendor._id.toString()) {
    throw new Error("Cannot connect same account");
  }

  // ALREADY LINKED CHECK
  if (
    currentVendor.linkedGroupId &&
    targetVendor.linkedGroupId &&
    currentVendor.linkedGroupId.toString() ===
      targetVendor.linkedGroupId.toString()
  ) {
    throw new Error("Accounts already linked");
  }

  let group;

  // CASE 1
  if (!currentVendor.linkedGroupId && !targetVendor.linkedGroupId) {
    group = await VendorAccountGroup.create({
      primaryVendorId: currentVendor._id,

      accounts: [
        {
          vendorId: currentVendor._id,

          serviceType: currentVendor.serviceType,
        },

        {
          vendorId: targetVendor._id,

          serviceType: targetVendor.serviceType,
        },
      ],
    });

    currentVendor.linkedGroupId = group._id;

    targetVendor.linkedGroupId = group._id;

    await currentVendor.save();

    await targetVendor.save();
  }

  // CASE 2
  else if (currentVendor.linkedGroupId && !targetVendor.linkedGroupId) {
    group = await VendorAccountGroup.findById(currentVendor.linkedGroupId);

    // DUPLICATE CHECK
    const alreadyExists = group.accounts.some(
      (acc) => acc.vendorId.toString() === targetVendor._id.toString(),
    );

    if (alreadyExists) {
      throw new Error("Accounts already linked");
    }

    group.accounts.push({
      vendorId: targetVendor._id,

      serviceType: targetVendor.serviceType,
    });

    await group.save();

    targetVendor.linkedGroupId = group._id;

    await targetVendor.save();
  }

  // CASE 3
  else if (!currentVendor.linkedGroupId && targetVendor.linkedGroupId) {
    group = await VendorAccountGroup.findById(targetVendor.linkedGroupId);

    // DUPLICATE CHECK
    const alreadyExists = group.accounts.some(
      (acc) => acc.vendorId.toString() === currentVendor._id.toString(),
    );

    if (alreadyExists) {
      throw new Error("Accounts already linked");
    }

    group.accounts.push({
      vendorId: currentVendor._id,

      serviceType: currentVendor.serviceType,
    });

    await group.save();

    currentVendor.linkedGroupId = group._id;

    await currentVendor.save();
  }

  return {
    success: true,

    message: "Accounts linked successfully",
  };
};

exports.getConnectedAccounts = async (currentVendorId) => {
  const currentVendor = await Vendor.findById(currentVendorId);

  if (!currentVendor) {
    throw new Error("Vendor not found");
  }

  // NO GROUP
  if (!currentVendor.linkedGroupId) {
    return [];
  }

  // GROUP
  const group = await VendorAccountGroup.findById(
    currentVendor.linkedGroupId,
  ).populate({
    path: "accounts.vendorId",

    select: "businessName serviceType status isActive userId",
  });

  if (!group) {
    return [];
  }

  const formattedAccounts = group.accounts
    .filter(
      (acc) =>
        acc.vendorId &&
        acc.vendorId._id.toString() !== currentVendorId.toString() &&
        acc.vendorId.status === "approved" &&
        acc.vendorId.isActive,
    )
    .map((acc) => ({
      vendorId: acc.vendorId._id,

      businessName: acc.vendorId.businessName,

      serviceType: acc.vendorId.serviceType,

      status: acc.vendorId.status,
    }));

  return formattedAccounts;
};

exports.switchVendorAccount = async (currentVendorId, targetVendorId) => {
  // CURRENT
  const currentVendor = await Vendor.findById(currentVendorId);

  if (!currentVendor) {
    throw new Error("Current vendor not found");
  }

  // TARGET
  const targetVendor = await Vendor.findById(targetVendorId);

  if (!targetVendor) {
    throw new Error("Target vendor not found");
  }

  // APPROVED CHECK
  if (targetVendor.status !== "approved") {
    throw new Error("Only approved accounts can be accessed");
  }

  // ACTIVE CHECK
  if (!targetVendor.isActive) {
    throw new Error("Vendor account is inactive");
  }

  // SAME GROUP CHECK
  if (!currentVendor.linkedGroupId || !targetVendor.linkedGroupId) {
    throw new Error("Accounts are not linked");
  }

  if (
    currentVendor.linkedGroupId.toString() !==
    targetVendor.linkedGroupId.toString()
  ) {
    throw new Error("Unauthorized account switch");
  }

  // USER
  const targetUser = await User.findById(targetVendor.userId);

  if (!targetUser) {
    throw new Error("User not found");
  }

  // NEW TOKEN
  const accessToken = jwt.sign(
    {
      id: targetUser._id,

      vendorId: targetVendor._id,
    },

    process.env.JWT_ACCESS_SECRET,

    {
      expiresIn: "1d",
    },
  );

  return {
    accessToken,

    vendor: {
      _id: targetVendor._id,

      businessName: targetVendor.businessName,

      serviceType: targetVendor.serviceType,

      status: targetVendor.status,
    },
  };
};
