const mongoose = require("mongoose");
const BikeService = require("./bikeService.model");
const BikeCompany = require("../company/bike.model");
const Tax = require("../../admin/tax/tax.model");
const Favorite = require("../../favorites/favorite.model");

//helper function to attach isFavorite flag to companies/services
const attachFavoriteFlag = async (items, userId, itemType) => {
  if (!userId || items.length === 0) {
    items.forEach((item) => (item.isFavorite = false));
    return items;
  }

  const itemIds = items.map((i) => i.company?.companyId || i.companyId || i.serviceId || i._id);

  const favorites = await Favorite.find({
    user: userId,
    itemType,
    itemId: { $in: itemIds },
  }).select("itemId");

  const favoriteSet = new Set(favorites.map((f) => f.itemId.toString()));

  items.forEach((item) => {
    const id = item.company?.companyId || item.companyId || item.serviceId || item._id;
    item.isFavorite = favoriteSet.has(id.toString());
  });

  return items;
};

const checkIsFavorite = async (itemId, userId, itemType) => {
  if (!userId || !itemId) return false;
  const fav = await Favorite.findOne({
    user: userId,
    itemType,
    itemId,
  }).select("_id");
  return !!fav;
};

//user side
exports.getBikes = async (query, userId = null) => {
  try {
    const { city = "", page = 1, limit = 10 } = query;

    const skip = (page - 1) * limit;

    //  MATCH (CITY BASED)
    const matchStage = {
      isActive: true,
    };

    const bikes = await BikeService.aggregate([
      { $match: matchStage },

      {
        $lookup: {
          from: "bikecompanies",
          localField: "bike",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },

      {
        $match: {
          "company.isActive": true,
          "company.location.city": {
            $regex: city,
            $options: "i",
          },
          "company.verificationStatus": "verified",
        },
      },

      {
        $project: {
          _id: 1,
          title: 1,
          bikeName: 1,
          bikeType: 1,
          pricePerDay: 1,
          discountPrice: 1,
          images: 1,

          "company._id": 1,
          "company.name": 1,
          "company.rating": 1,
          "company.location": 1,
        },
      },

      { $sort: { pricePerDay: 1 } },

      { $skip: Number(skip) },
      { $limit: Number(limit) },
    ]);

    const taxDoc = await Tax.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;

    const formattedBikes = bikes.map((bike) => {
      const effectivePrice =
        bike.discountPrice > 0 ? bike.discountPrice : bike.pricePerDay;

      const totalTax = Number(
        ((effectivePrice * taxPercentage) / 100).toFixed(2),
      );

      const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));

      return {
        serviceId: bike._id,
        serviceType: "bike",

        bikeName: bike.bikeName,
        bikeType: bike.bikeType,

        pricePerDay: effectivePrice,
        totalPriceWithTax,
        taxPercentage,

        thumbnail: bike.images?.[0] || null,

        company: {
          companyId: bike.company._id,
          serviceType: "bike",
          name: bike.company.name,
          city: bike.company.location?.city,
          rating: bike.company.rating?.average || 0,
        },
      };
    });

    const updatedBikes = await attachFavoriteFlag(formattedBikes, userId, "bike");

    return {
      bikes: updatedBikes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        count: updatedBikes.length,
      },
    };
  } catch (error) {
    throw error;
  }
};

exports.getBikeCompanyDetails = async (id, userId = null) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid company id");
    }

    const company = await BikeCompany.findOne({
      _id: id,
      isActive: true,
      verificationStatus: "verified",
    })
      .select("name location description images rating features rentalPolicies")
      .lean();

    if (!company) {
      throw new Error("Bike company not found");
    }

    //SERVICES FETCH (ALL BIKES OF THIS COMPANY)
    const services = await BikeService.find({
      bike: id,
      isActive: true,
    })
      .select(
        "title bikeName bikeType pricePerDay discountPrice images features meta",
      )
      .sort({ pricePerDay: 1 })
      .lean();

    const taxDoc = await Tax.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;

    const formattedServices = services.map((service) => {
      const effectivePrice =
        service.discountPrice > 0 ? service.discountPrice : service.pricePerDay;

      const totalTax = Number(
        ((effectivePrice * taxPercentage) / 100).toFixed(2),
      );

      const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));

      return {
        serviceId: service._id,
        serviceType: "bike",

        bikeName: service.bikeName,
        bikeType: service.bikeType,

        mileage: service.meta?.mileage,
        gearType: service.meta?.gearType,

        pricePerDay: effectivePrice,
        totalPriceWithTax,
        taxPercentage,

        thumbnail: service.images?.[0] || null,

        features: service.features || [],
      };
    });

    const isFavorite = await checkIsFavorite(company._id, userId, "bike");

    const formattedCompany = {
      companyId: company._id,
      serviceType: "bike",
      isFavorite,
      name: company.name,
      description: company.description,

      city: company.location?.city,
      state: company.location?.state,

      rating: company.rating?.average || 0,
      reviews: company.rating?.count || 0,

      images: company.images || [],
      features: company.features || [],

      //IMPORTANT FOR BIKE RENTAL
      rentalPolicies: {
        helmetIncluded: company.rentalPolicies?.helmetIncluded,
        fuelPolicy: company.rentalPolicies?.fuelPolicy,
        securityDeposit: company.rentalPolicies?.securityDeposit,
        licenseRequired: company.rentalPolicies?.licenseRequired,
      },
    };

    return {
      company: formattedCompany,
      services: formattedServices,
      isFavorite,
    };
  } catch (error) {
    throw error;
  }
};

exports.getBikeServiceDetails = async (id, userId = null) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid service id");
    }

    const service = await BikeService.findOne({
      _id: id,
      isActive: true,
    }).lean();

    if (!service) {
      throw new Error("Bike service not found");
    }

    const company = await BikeCompany.findOne({
      _id: service.bike,
      isActive: true,
    })
      .select("name location rating images description rentalPolicies")
      .lean();

    const taxDoc = await Tax.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;

    const effectivePrice =
      service.discountPrice > 0 ? service.discountPrice : service.pricePerDay;

    const totalTax = Number(
      ((effectivePrice * taxPercentage) / 100).toFixed(2),
    );

    const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));

    const isFavorite = await checkIsFavorite(company?._id, userId, "bike");

    const formattedService = {
      serviceId: service._id,
      serviceType: "bike",
      isFavorite,

      title: service.title,
      description: service.description,

      bikeName: service.bikeName,
      bikeType: service.bikeType,
      engineCC: service.engineCC,
      fuelType: service.fuelType,

      mileage: service.meta?.mileage,
      gearType: service.meta?.gearType,

      pricePerDay: effectivePrice,
      totalPriceWithTax,
      taxPercentage,

      maxDurationDays: service.maxDurationDays,

      images: service.images || [],
      features: service.features || [],
    };

    const formattedCompany = {
      companyId: company?._id,
      serviceType: "bike",
      isFavorite,
      name: company?.name,
      city: company?.location?.city,
      rating: company?.rating?.average || 0,
      images: company?.images || [],
      description: company?.description,

      rentalPolicies: company?.rentalPolicies || {},
    };

    return {
      company: formattedCompany,
      service: formattedService,
      isFavorite,
    };
  } catch (error) {
    throw error;
  }
};

exports.calculateBikePrice = async (body) => {
  try {
    const { serviceId, startDate, endDate } = body;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    if (!startDate || !endDate) {
      throw new Error("Start date and end date are required");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      throw new Error("End date must be greater than start date");
    }

    //CALCULATE DAYS
    const diffTime = end - start;
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const service = await BikeService.findOne({
      _id: serviceId,
      isActive: true,
    }).lean();

    if (!service) {
      throw new Error("Bike service not found");
    }

    if (totalDays > service.maxDurationDays) {
      throw new Error(
        `Maximum rental duration is ${service.maxDurationDays} days`,
      );
    }

    const pricePerDay =
      service.discountPrice > 0 ? service.discountPrice : service.pricePerDay;

    const totalBasePrice = pricePerDay * totalDays;

    const taxDoc = await Tax.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;

    const totalTax = Number(
      ((totalBasePrice * taxPercentage) / 100).toFixed(2),
    );

    const finalAmount = Number((totalBasePrice + totalTax).toFixed(2));

    return {
      serviceId,

      pricePerDay,
      totalDays,

      totalBasePrice,
      taxPercentage,
      totalTax,

      finalAmount,
    };
  } catch (error) {
    throw error;
  }
};

//vendor side
exports.createBikeService = async (data, vendorId) => {
  try {
    const {
      bikeId,
      title,
      bikeName,
      bikeType,
      engineCC,
      fuelType = "petrol",
      pricePerDay,
      discountPrice = 0,
      maxDurationDays = 7,
      description,
      features = [],
      meta = {},
      images = [],
    } = data;

    if (!bikeId || !mongoose.Types.ObjectId.isValid(bikeId)) {
      throw new Error("Valid bikeId is required");
    }

    if (!title) throw new Error("Title is required");
    if (!bikeName) throw new Error("Bike name is required");
    if (!bikeType) throw new Error("Bike type is required");

    if (!pricePerDay || pricePerDay < 0) {
      throw new Error("Valid price per day is required");
    }

    if (discountPrice > pricePerDay) {
      throw new Error("Discount price cannot exceed price per day");
    }

    const bikeCompany = await BikeCompany.findOne({
      _id: bikeId,
      vendorId: vendorId,
      isActive: true,
    });

    if (!bikeCompany) {
      throw new Error("Bike company not found or unauthorized");
    }

    const service = await BikeService.create({
      bike: bikeId,

      title: title.trim(),

      bikeName: bikeName.trim(),
      bikeType,
      engineCC,
      fuelType,

      pricePerDay,
      discountPrice,
      maxDurationDays,

      description: description?.trim() || "",
      features,
      meta,
      images,

      isActive: true,
    });

    return service;
  } catch (error) {
    throw error;
  }
};

exports.getVendorBikeServices = async (query = {}, vendorId) => {
  try {
    const { bikeId, search, bikeType, page = 1, limit = 10 } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const companies = await BikeCompany.find({ vendorId: vendorId })
      .select("_id")
      .lean();

    const bikeIds = companies.map((c) => c._id);

    const filter = {
      bike: { $in: bikeIds },
    };

    if (bikeId) {
      filter.bike = bikeId;
    }

    if (bikeType) {
      filter.bikeType = bikeType;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { bikeName: { $regex: search, $options: "i" } },
      ];
    }

    const services = await BikeService.find(filter)
      .populate("bike", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await BikeService.countDocuments(filter);

    const formatted = services.map((s) => ({
      id: s._id,

      title: s.title,

      company: s.bike?.name || null,

      bike: {
        name: s.bikeName,
        type: s.bikeType,
        engine: s.engineCC,
      },

      pricing: {
        pricePerDay: s.pricePerDay,
        discountPrice: s.discountPrice,
      },

      isActive: s.isActive,
    }));

    return {
      count: formatted.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: formatted,
    };
  } catch (error) {
    throw error;
  }
};

exports.getVendorBikeServiceById = async (serviceId, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    const service = await BikeService.findById(serviceId)
      .populate("bike", "name vendorId")
      .lean();

    if (!service) {
      throw new Error("Bike service not found");
    }

    if (service.bike.vendorId.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }

    const formatted = {
      id: service._id,

      company: {
        id: service.bike._id,
        name: service.bike.name,
      },

      title: service.title,

      bike: {
        name: service.bikeName,
        type: service.bikeType,
        engine: service.engineCC,
        fuel: service.fuelType,
      },

      pricing: {
        pricePerDay: service.pricePerDay,
        discountPrice: service.discountPrice,
      },

      maxDurationDays: service.maxDurationDays,

      meta: service.meta || {},

      description: service.description || "",

      features: service.features || [],

      images: service.images || [],

      isActive: service.isActive,

      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };

    return formatted;
  } catch (error) {
    throw error;
  }
};

exports.updateVendorBikeService = async (serviceId, vendorId, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    const service = await BikeService.findById(serviceId).populate(
      "bike",
      "vendorId",
    );

    if (!service) {
      throw new Error("Bike service not found");
    }

    if (service.bike.vendorId.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }

    if (data.pricePerDay !== undefined && data.pricePerDay < 0) {
      throw new Error("Invalid price per day");
    }

    if (
      data.discountPrice !== undefined &&
      data.pricePerDay !== undefined &&
      data.discountPrice > data.pricePerDay
    ) {
      throw new Error("Discount cannot exceed price");
    }

    const allowedFields = [
      "title",
      "bikeName",
      "bikeType",
      "engineCC",
      "fuelType",
      "pricePerDay",
      "discountPrice",
      "maxDurationDays",
      "meta",
      "description",
      "features",
      "images",
      "isActive",
    ];

    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        service[field] =
          typeof data[field] === "string" ? data[field].trim() : data[field];
      }
    });

    await service.save();

    return service;
  } catch (error) {
    throw error;
  }
};

exports.deleteVendorBikeService = async (serviceId, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    const service = await BikeService.findById(serviceId).populate(
      "bike",
      "vendorId",
    );

    if (!service) {
      throw new Error("Bike service not found");
    }

    if (service.bike.vendorId.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }

    service.isActive = false;
    await service.save();

    // Hard delete
    // await BikeService.findByIdAndDelete(serviceId);

    return;
  } catch (error) {
    throw error;
  }
};
