const mongoose = require("mongoose");
const CabService = require("./cabService.model");
const CabCompany = require("../company/cab.model");
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

//user side...

exports.getCabs = async (query, userId = null) => {
  try {
    const { pickup = "", drop = "", page = 1, limit = 10 } = query;

    const skip = (page - 1) * limit;

    // MATCH (ROUTE BASED)
    const matchStage = {
      isActive: true,
      pickupLocation: { $regex: pickup, $options: "i" },
      dropLocation: { $regex: drop, $options: "i" },
    };

    const cabs = await CabService.aggregate([
      { $match: matchStage },

      {
        $lookup: {
          from: "cabcompanies",
          localField: "cab",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },

      {
        $match: {
          "company.isActive": true,
          "company.verificationStatus": "verified",
        },
      },

      {
        $project: {
          _id: 1,
          title: 1,
          carName: 1,
          cabType: 1,
          capacity: 1,
          images: 1,
          basePrice: 1,
          discountPrice: 1,
          meta: 1,

          "company._id": 1,
          "company.name": 1,
          "company.rating": 1,
          "company.location": 1,
        },
      },

      { $sort: { basePrice: 1 } },

      { $skip: Number(skip) },
      { $limit: Number(limit) },
    ]);

    const taxDoc = await Tax.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;

    const formattedCabs = cabs.map((cab) => {
      const effectivePrice =
        cab.discountPrice > 0 ? cab.discountPrice : cab.basePrice;

      const totalTax = Number(
        ((effectivePrice * taxPercentage) / 100).toFixed(2),
      );

      const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));

      return {
        serviceId: cab._id,
        serviceType: "cab",

        title: cab.title,
        carName: cab.carName,
        cabType: cab.cabType,
        capacity: cab.capacity,

        pickup: pickup,
        drop: drop,

        distance: cab.meta?.distance,
        duration: cab.meta?.duration,

        price: effectivePrice,
        totalPriceWithTax,
        taxPercentage,

        thumbnail: cab.images?.[0] || null,

        company: {
          companyId: cab.company._id,
          serviceType: "cab",
          name: cab.company.name,
          city: cab.company.location?.city,
          rating: cab.company.rating?.average || 0,
        },
      };
    });

    const updatedCabs = await attachFavoriteFlag(formattedCabs, userId, "cab");

    return {
      cabs: updatedCabs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        count: updatedCabs.length,
      },
    };
  } catch (error) {
    throw error;
  }
};

exports.getCabCompanyDetails = async (id, userId = null) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid company id");
    }

    const company = await CabCompany.findOne({
      _id: id,
      isActive: true,
      verificationStatus: "verified",
    })
      .select("name location description images rating features")
      .lean();

    if (!company) {
      throw new Error("Cab company not found");
    }

    //SERVICES FETCH (ALL CARS OF THIS COMPANY)
    const services = await CabService.find({
      cab: id,
      isActive: true,
    })
      .select(
        "title carName cabType capacity basePrice discountPrice images meta features pickupLocation dropLocation",
      )
      .sort({ basePrice: 1 })
      .lean();

    const taxDoc = await Tax.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;

    // FORMAT SERVICES + TAX APPLY
    const formattedServices = services.map((service) => {
      const effectivePrice =
        service.discountPrice > 0 ? service.discountPrice : service.basePrice;

      const totalTax = Number(
        ((effectivePrice * taxPercentage) / 100).toFixed(2),
      );

      const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));

      return {
        serviceId: service._id,
        serviceType: "cab",

        title: service.title,
        carName: service.carName,
        cabType: service.cabType,
        capacity: service.capacity,

        route: {
          pickup: service.pickupLocation,
          drop: service.dropLocation,
        },

        distance: service.meta?.distance,
        duration: service.meta?.duration,

        price: effectivePrice,
        totalPriceWithTax,
        taxPercentage,

        thumbnail: service.images?.[0] || null,

        features: service.features || [],
      };
    });

    const isFavorite = await checkIsFavorite(company._id, userId, "cab");

    const formattedCompany = {
      companyId: company._id,
      serviceType: "cab",
      isFavorite,
      name: company.name,
      description: company.description,
      city: company.location?.city,
      state: company.location?.state,
      rating: company.rating?.average || 0,
      reviews: company.rating?.count || 0,
      images: company.images || [],
      features: company.features || [],
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

exports.getCabServiceDetails = async (id, userId = null) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid service id");
    }

    const service = await CabService.findOne({
      _id: id,
      isActive: true,
    }).lean();

    if (!service) {
      throw new Error("Cab service not found");
    }

    const company = await CabCompany.findOne({
      _id: service.cab,
      isActive: true,
    })
      .select("name location rating images description")
      .lean();

    const taxDoc = await Tax.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;

    //PRICE CALCULATION
    const effectivePrice =
      service.discountPrice > 0 ? service.discountPrice : service.basePrice;

    const totalTax = Number(
      ((effectivePrice * taxPercentage) / 100).toFixed(2),
    );

    const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));

    const isFavorite = await checkIsFavorite(company?._id, userId, "cab");

    const formattedService = {
      serviceId: service._id,
      serviceType: "cab",
      isFavorite,

      title: service.title,
      description: service.description,

      carName: service.carName,
      cabType: service.cabType,
      capacity: service.capacity,

      route: {
        pickup: service.pickupLocation,
        drop: service.dropLocation,
      },

      distance: service.meta?.distance,
      duration: service.meta?.duration,

      price: effectivePrice,
      totalPriceWithTax,
      taxPercentage,

      images: service.images || [],
      features: service.features || [],

      carNumber: service.carNumber || null,
    };

    const formattedCompany = {
      companyId: company?._id,
      serviceType: "cab",
      isFavorite,
      name: company?.name,
      city: company?.location?.city,
      rating: company?.rating?.average || 0,
      images: company?.images || [],
      description: company?.description,
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

//vendor side....
exports.createCabService = async (data, vendorId) => {
  try {
    const {
      cabId,
      title,
      pickupLocation,
      dropLocation,
      carName,
      cabType,
      capacity,
      carNumber,
      basePrice,
      discountPrice = 0,
      meta = {},
      description,
      features = [],
      images = [],
    } = data;

    if (!cabId || !mongoose.Types.ObjectId.isValid(cabId)) {
      throw new Error("Valid cabId is required");
    }

    if (!title) throw new Error("Title is required");

    if (!pickupLocation || !dropLocation) {
      throw new Error("Pickup and Drop locations are required");
    }

    if (!carName) throw new Error("Car name is required");

    if (!cabType) throw new Error("Cab type is required");

    if (!capacity || capacity <= 0) {
      throw new Error("Valid capacity is required");
    }

    if (!basePrice || basePrice < 0) {
      throw new Error("Valid base price is required");
    }

    if (discountPrice > basePrice) {
      throw new Error("Discount price cannot exceed base price");
    }

    //VERIFY OWNERSHIP
    const cab = await CabCompany.findOne({
      _id: cabId,
      vendorId: vendorId,
      isActive: true,
    });

    if (!cab) {
      throw new Error("Cab company not found or unauthorized");
    }

    //CREATE SERVICE
    const service = await CabService.create({
      cab: cabId,

      title: title.trim(),

      pickupLocation: pickupLocation.trim(),
      dropLocation: dropLocation.trim(),

      carName: carName.trim(),
      cabType,
      capacity,
      carNumber: carNumber?.trim() || "",

      basePrice,
      discountPrice,

      meta,
      description: description?.trim() || "",

      features,
      images,

      isActive: true,
    });

    return service;
  } catch (error) {
    throw error;
  }
};

exports.getVendorCabServices = async (query = {}, vendorId) => {
  try {
    const { cabId, search, cabType, page = 1, limit = 10 } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const vendorCabs = await CabCompany.find({ vendorId: vendorId })
      .select("_id")
      .lean();

    const cabIds = vendorCabs.map((c) => c._id);

    const filter = {
      cab: { $in: cabIds },
    };

    if (cabId) {
      filter.cab = cabId;
    }

    if (cabType) {
      filter.cabType = cabType;
    }

    //SEARCH (title + route)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { pickupLocation: { $regex: search, $options: "i" } },
        { dropLocation: { $regex: search, $options: "i" } },
      ];
    }

    const services = await CabService.find(filter)
      .populate("cab", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await CabService.countDocuments(filter);

    const formatted = services.map((s) => ({
      id: s._id,

      title: s.title,

      cabCompany: s.cab?.name || null,

      route: {
        pickup: s.pickupLocation,
        drop: s.dropLocation,
      },

      car: {
        name: s.carName,
        type: s.cabType,
        capacity: s.capacity,
      },

      pricing: {
        basePrice: s.basePrice,
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

exports.getVendorCabServiceById = async (serviceId, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    const service = await CabService.findById(serviceId)
      .populate("cab", "name vendorId")
      .lean();

    if (!service) {
      throw new Error("Cab service not found");
    }

    if (service.cab.vendorId.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }

    const formatted = {
      id: service._id,

      cabCompany: {
        id: service.cab._id,
        name: service.cab.name,
      },

      title: service.title,

      route: {
        pickup: service.pickupLocation,
        drop: service.dropLocation,
      },

      car: {
        name: service.carName,
        type: service.cabType,
        capacity: service.capacity,
        number: service.carNumber,
      },

      pricing: {
        basePrice: service.basePrice,
        discountPrice: service.discountPrice,
      },

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

exports.updateVendorCabService = async (serviceId, vendorId, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    //Find service + ownership check
    const service = await CabService.findById(serviceId).populate(
      "cab",
      "vendorId",
    );

    if (!service) {
      throw new Error("Cab service not found");
    }

    if (service.cab.vendorId.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }

    if (data.basePrice !== undefined && data.basePrice < 0) {
      throw new Error("Base price must be valid");
    }

    const finalBasePrice = data.basePrice ?? service.basePrice;

    const finalDiscountPrice = data.discountPrice ?? service.discountPrice;

    if (finalDiscountPrice > finalBasePrice) {
      throw new Error("Discount cannot exceed base price");
    }

    const allowedFields = [
      "title",
      "pickupLocation",
      "dropLocation",
      "carName",
      "cabType",
      "capacity",
      "carNumber",
      "basePrice",
      "discountPrice",
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

exports.deleteVendorCabService = async (serviceId, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    //Find service + ownership check
    const service = await CabService.findById(serviceId).populate(
      "cab",
      "vendorId",
    );

    if (!service) {
      throw new Error("Cab service not found");
    }

    if (service.cab.vendorId.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }

    //Soft Delete
    service.isActive = false;
    await service.save();

    // Hard Delete
    // await CabService.findByIdAndDelete(serviceId);

    return;
  } catch (error) {
    throw error;
  }
};
