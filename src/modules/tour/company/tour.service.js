const TourCompany = require("./tour.model");
const logger = require("../../../shared/utils/logger");

exports.createTourCompany = async (data, vendor) => {
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
      coordinates,
      images = [],
      documents = [],
      description,
      features = [],
      tags = [],
    } = data;

    // VALIDATIONS
    if (!name || !name.trim()) {
      throw new Error("Tour company name is required");
    }

    if (!location || !location.city) {
      throw new Error("Location city is required");
    }

    // CHECK EXISTING COMPANY
    let tourCompany = await TourCompany.findOne({
      vendorId: vendor._id,
    });

    if (tourCompany) {
      // UPDATE EXISTING
      Object.assign(tourCompany, {
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

        tags,

        verificationStatus: "pending",
      });

      await tourCompany.save();
    } else {
      // CREATE NEW
      tourCompany = await TourCompany.create({
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

        tags,

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

    return tourCompany;
  } catch (error) {
    throw error;
  }
};
