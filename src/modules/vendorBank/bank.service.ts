import VendorBank from "./bank.model.js";
import Vendor from "../vendors/vendor.model.js";
import logger from "../../shared/utils/logger.js";

//Create bank details
export const createBankDetails = async (vendor: any, bankData: any) => {
  try {
    if (vendor.isSubmitted && vendor.status !== "rejected") {
      throw new Error("Already submitted. Cannot edit.");
    }

    if (vendor.currentStep !== 2 && vendor.status !== "rejected") {
      throw new Error("Invalid step flow");
    }

    if (vendor.status === "rejected" && !vendor.rejectedSteps.includes(3)) {
      throw new Error("Fix required step first");
    }

    //UPSERT BANK
    let bank = await VendorBank.findOne({ vendorId: vendor._id });

    if (bank) {
      Object.assign(bank, bankData);
      bank.verificationStatus = "pending";
      await bank.save();
    } else {
      bank = await VendorBank.create({
        vendorId: vendor._id,
        ...bankData,
        verificationStatus: "pending",
      });
    }

    //STEP UPDATE
    vendor.currentStep = 3;
    vendor.registrationStep = Math.max(vendor.registrationStep, 3);

    if (vendor.rejectedSteps?.includes(3)) {
      vendor.rejectedSteps = vendor.rejectedSteps.filter(
        (s: number) => s !== 3,
      );
    }

    if (vendor.rejectionReasons) {
      delete vendor.rejectionReasons["3"];
    }

    if (!vendor.rejectedSteps || vendor.rejectedSteps.length === 0) {
      vendor.status = "draft";
    }

    await vendor.save();

    return bank;
  } catch (error) {
    logger.error("Service Error: createBankDetails", error);
    throw error;
  }
};

const bank_service = {
  createBankDetails,
};

export default bank_service;
