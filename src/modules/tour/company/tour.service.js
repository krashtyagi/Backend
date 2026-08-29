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

exports.getAllTourCompanies = async (query = {}) => {
  try {
    const TourService = require("../service/tourService.model");
    const { city, search, featured, rank, page = 1, limit = 50 } = query;
    const filter = {};

    if (city && city.trim()) {
      filter["location.city"] = { $regex: new RegExp(city.trim(), "i") };
    }

    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { "location.city": { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (featured !== undefined) {
      filter.isFeatured = featured === "true" || featured === true;
    }

    if (rank) {
      filter.rank = rank;
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 50);
    const skip = (pageNum - 1) * limitNum;

    const total = await TourCompany.countDocuments(filter);
    const companies = await TourCompany.find(filter)
      .populate({
        path: "vendorId",
        select: "businessName businessEmail logo currentStep status",
      })
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Attach lowest tour service starting price and total tour count for each company
    const companyIds = companies.map((c) => c._id);
    let minPrices = [];
    if (companyIds.length > 0) {
      minPrices = await TourService.aggregate([
        { $match: { tour: { $in: companyIds } } },
        {
          $group: {
            _id: "$tour",
            minPrice: {
              $min: {
                $cond: [
                  { $gt: ["$discountPrice", 0] },
                  "$discountPrice",
                  "$basePrice",
                ],
              },
            },
            tourCount: { $sum: 1 },
          },
        },
      ]);
    }

    const priceMap = {};
    const countMap = {};
    minPrices.forEach((p) => {
      priceMap[p._id.toString()] = p.minPrice;
      countMap[p._id.toString()] = p.tourCount;
    });

    const formattedCompanies = companies.map((company) => {
      const companyIdStr = company._id.toString();
      const resolvedLogo =
        company.logo?.url ||
        company.vendorId?.logo?.url ||
        company.images?.[0]?.url ||
        `https://api.dicebear.com/10.x/initials/svg?seed=${encodeURIComponent(company.name)}`;

      return {
        ...company,
        logo: resolvedLogo,
        startingPrice: priceMap[companyIdStr] || 999,
        totalTours: countMap[companyIdStr] || 0,
        city: company.location?.city || "India",
      };
    });

    return {
      companies: formattedCompanies,
      total,
      page: pageNum,
      limit: limitNum,
    };
  } catch (error) {
    logger.error("Service Error: getAllTourCompanies", error);
    throw error;
  }
};

exports.getTourCompanyById = async (id) => {
  try {
    const TourService = require("../service/tourService.model");
    const company = await TourCompany.findById(id)
      .populate({
        path: "vendorId",
        select: "businessName businessEmail logo currentStep status",
      })
      .lean();

    if (!company) {
      throw new Error("Tour company not found");
    }

    const tours = await TourService.find({ tour: id }).lean();
    const resolvedLogo =
      company.logo?.url ||
      company.vendorId?.logo?.url ||
      company.images?.[0]?.url ||
      `https://api.dicebear.com/10.x/initials/svg?seed=${encodeURIComponent(company.name)}`;

    return {
      ...company,
      logo: resolvedLogo,
      tours,
    };
  } catch (error) {
    logger.error("Service Error: getTourCompanyById", error);
    throw error;
  }
};

exports.getTourCompaniesGroupedByCity = async () => {
  try {
    const { companies } = await exports.getAllTourCompanies({ limit: 100 });
    const grouped = {};

    companies.forEach((company) => {
      const city = company.city?.trim() || "Others";
      if (!grouped[city]) {
        grouped[city] = [];
      }
      grouped[city].push(company);
    });

    return grouped;
  } catch (error) {
    logger.error("Service Error: getTourCompaniesGroupedByCity", error);
    throw error;
  }
};
