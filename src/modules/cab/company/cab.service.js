const CabCompany = require("./cab.model");
const logger = require("../../../shared/utils/logger");

exports.createCabCompany = async (vendor, data) => {
  try {
    // BLOCK IF ALREADY SUBMITTED
    if (vendor.isSubmitted && vendor.status !== "rejected") {
      throw new Error("Already submitted. Cannot edit.");
    }

    // STEP VALIDATION
    if (vendor.currentStep !== 3 && vendor.status !== "rejected") {
      throw new Error("Invalid step flow");
    }

    // REJECTION FLOW
    if (vendor.status === "rejected" && vendor.rejectedStep !== 4) {
      throw new Error("Fix required step first");
    }

    const {
      name,
      location,
      description,
      images = [],
      features = [],
      documents = [],
      address,
      coordinates,
    } = data;

    // VALIDATION
    if (!name || !name.trim()) {
      throw new Error("Cab company name is required");
    }

    if (!location || !location.city) {
      throw new Error("Location city is required");
    }

    // CHECK EXISTING CAB COMPANY
    let cab = await CabCompany.findOne({
      vendorId: vendor._id,
    });

    if (cab) {
      // UPDATE EXISTING
      Object.assign(cab, {
        name: name.trim(),

        location: {
          city: location.city.trim(),
          state: location.state || "",
          country: location.country || "India",
        },

        address: address?.trim() || "",

        coordinates: {
          lat: coordinates?.lat || null,
          lng: coordinates?.lng || null,
        },

        description: description?.trim() || "",

        images,
        features,
        documents,

        verificationStatus: "pending",
      });

      await cab.save();
    } else {
      // CREATE NEW
      cab = await CabCompany.create({
        name: name.trim(),

        location: {
          city: location.city.trim(),
          state: location.state || "",
          country: location.country || "India",
        },

        address: address?.trim() || "",

        coordinates: {
          lat: coordinates?.lat || null,
          lng: coordinates?.lng || null,
        },

        description: description?.trim() || "",

        images,
        features,
        documents,

        vendorId: vendor._id,

        verificationStatus: "pending",

        isActive: false,
      });
    }

    // STEP UPDATE
    vendor.currentStep = 4;

    vendor.registrationStep = Math.max(vendor.registrationStep, 4);

    // RESET REJECTION
    if (vendor.status === "rejected") {
      vendor.status = "draft";
      vendor.rejectedStep = null;
      vendor.adminRemark = null;
    }

    await vendor.save();

    return cab;
  } catch (error) {
    logger.error("Service Error: createCabCompany", error);

    throw error;
  }
};
