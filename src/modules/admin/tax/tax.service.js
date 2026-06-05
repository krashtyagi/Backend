const Tax = require("./tax.model");

exports.setTax = async (userId, taxPercentage) => {
  if (taxPercentage < 0 || taxPercentage > 100) {
    throw new Error("Invalid tax percentage");
  }

  await Tax.updateMany({ isActive: true }, { isActive: false });

  const tax = await Tax.create({
    taxPercentage,
    isActive: true,
    createdBy: userId,
  });

  return tax;
};

exports.getActiveTax = async () => {
  const tax = await Tax.findOne({ isActive: true });

  if (!tax) {
    throw new Error("No active tax found");
  }

  return tax;
};