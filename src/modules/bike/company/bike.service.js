const BikeCompany = require("./bike.model");
const logger = require("../../../shared/utils/logger");

exports.createBikeCompany = async (data, vendor) => {
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
      address,
      images = [],
      description,
      features = [],
      documents = [],
      coordinates,

      rentalPolicies = {},
    } = data;

    // VALIDATIONS
    if (!name || !name.trim()) {
      throw new Error("Bike company name is required");
    }

    if (!location || !location.city) {
      throw new Error("Location city is required");
    }

    // CHECK EXISTING COMPANY
    let bikeCompany = await BikeCompany.findOne({
      vendorId: vendor._id,
    });

    if (bikeCompany) {
      // UPDATE EXISTING
      Object.assign(bikeCompany, {
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

        images,

        documents,

        description: description?.trim() || "",

        features,

        rentalPolicies,

        verificationStatus: "pending",
      });

      await bikeCompany.save();
    } else {
      // CREATE NEW
      bikeCompany = await BikeCompany.create({
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

        images,

        documents,

        description: description?.trim() || "",

        features,

        rentalPolicies,

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

    return bikeCompany;
  } catch (error) {
    logger.error("Service Error: createCabCompany", error);

    throw error;
  }
};
