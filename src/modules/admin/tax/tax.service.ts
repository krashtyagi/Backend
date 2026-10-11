import Tax from "./tax.model";

export const setTax = async (userId: any, taxPercentage: any) => {
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

export const getActiveTax = async () => {
  const tax = await Tax.findOne({ isActive: true });

  if (!tax) {
    throw new Error("No active tax found");
  }

  return tax;
};

export class TaxService {
  setTax = setTax;
  getActiveTax = getActiveTax;
}

export const taxService = new TaxService();

const tax_service = {
  setTax,
  getActiveTax,
};

export default tax_service;
