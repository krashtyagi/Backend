const mongoose = require("mongoose");
const TourService = require("./tourService.model");
const TourCompany = require("../company/tour.model");
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
exports.getTours = async (query, userId = null) => {
  try {
    const { search = "", page = 1, limit = 10 } = query;

    const skip = (page - 1) * limit;

    const matchStage = {
      isActive: true,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { destinations: { $regex: search, $options: "i" } },
      ],
    };

    //AGGREGATION (JOIN COMPANY)
    const tours = await TourService.aggregate([
      { $match: matchStage },

      {
        $lookup: {
          from: "tourcompanies",
          localField: "tour",
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
          destinations: 1,
          basePrice: 1,
          discountPrice: 1,
          images: 1,
          duration: 1,
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

    const formattedTours = tours.map((tour) => {
      const effectivePrice =
        tour.discountPrice > 0 ? tour.discountPrice : tour.basePrice;

      const totalTax = Number(
        ((effectivePrice * taxPercentage) / 100).toFixed(2),
      );

      const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));

      return {
        serviceId: tour._id,
        serviceType: "tour",

        title: tour.title,
        destinations: tour.destinations,
        duration: `${tour.duration.days}D/${tour.duration.nights}N`,

        price: effectivePrice,
        totalPriceWithTax,
        taxPercentage,

        thumbnail: tour.images?.[0] || null,

        company: {
          companyId: tour.company._id,
          serviceType: "tour",
          name: tour.company.name,
          city: tour.company.location?.city,
          rating: tour.company.rating?.average || 0,
        },
      };
    });

    const updatedTours = await attachFavoriteFlag(formattedTours, userId, "tour");

    return {
      tours: updatedTours,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        count: updatedTours.length,
      },
    };
  } catch (error) {
    throw error;
  }
};

exports.getCompanyDetails = async (id, userId = null) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid company id");
    }

    const company = await TourCompany.findOne({
      _id: id,
      isActive: true,
      verificationStatus: "verified",
    })
      .select("name location description images rating features")
      .lean();

    if (!company) {
      throw new Error("Tour company not found");
    }

    const services = await TourService.find({
      tour: id,
      isActive: true,
    })
      .select("title basePrice discountPrice duration images features")
      .sort({ basePrice: 1 })
      .lean();

    const taxDoc = await Tax.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;

    const formattedServices = services.map((service) => {
      const effectivePrice =
        service.discountPrice > 0 ? service.discountPrice : service.basePrice;

      const totalTax = Number(
        ((effectivePrice * taxPercentage) / 100).toFixed(2),
      );

      const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));

      return {
        serviceId: service._id,
        serviceType: "tour",

        title: service.title,
        duration: `${service.duration.days}D/${service.duration.nights}N`,

        price: effectivePrice,
        totalPriceWithTax,
        taxPercentage,

        thumbnail: service.images?.[0] || null,

        features: service.features || [],
      };
    });

    const isFavorite = await checkIsFavorite(company._id, userId, "tour");

    const formattedCompany = {
      companyId: company._id,
      serviceType: "tour",
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

exports.getTourServiceDetails = async (id, userId = null) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid service id");
    }

    //  SERVICE FETCH
    const service = await TourService.findOne({
      _id: id,
      isActive: true,
    }).lean();

    if (!service) {
      throw new Error("Tour service not found");
    }

    //  COMPANY FETCH
    const company = await TourCompany.findOne({
      _id: service.tour,
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

    const isFavorite = await checkIsFavorite(company?._id, userId, "tour");

    const formattedService = {
      serviceId: service._id,
      serviceType: "tour",
      isFavorite,

      title: service.title,
      description: service.description,
      destinations: service.destinations,

      duration: `${service.duration.days}D/${service.duration.nights}N`,

      price: effectivePrice,
      totalPriceWithTax,
      taxPercentage,

      images: service.images || [],
      features: service.features || [],

      maxPeople: service.maxPeople,

      meta: service.meta || {},

      itinerary: service.itinerary || [],
    };

    const formattedCompany = {
      companyId: company?._id,
      serviceType: "tour",
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

//vendor side
exports.createTourService = async (data, vendorId) => {
  try {
    const {
      tourId,
      title,
      destinations = [],
      duration,
      basePrice,
      discountPrice = 0,
      description,
      features = [],
      images = [],
      itinerary = [],
      meta = {},
      maxPeople = 10,
    } = data;

    if (!tourId || !mongoose.Types.ObjectId.isValid(tourId)) {
      throw new Error("Valid tourId is required");
    }

    if (!title) throw new Error("Title is required");

    if (!duration?.days || !duration?.nights) {
      throw new Error("Duration (days & nights) is required");
    }

    if (!basePrice || basePrice < 0) {
      throw new Error("Valid base price is required");
    }

    if (discountPrice > basePrice) {
      throw new Error("Discount cannot exceed base price");
    }

    const tourCompany = await TourCompany.findOne({
      _id: tourId,
      vendorId: vendorId,
      isActive: true,
    });

    if (!tourCompany) {
      throw new Error("Tour company not found or unauthorized");
    }

    if (!Array.isArray(itinerary) || itinerary.length === 0) {
      throw new Error("Itinerary is required");
    }

    if (itinerary.length !== duration.days) {
      throw new Error("Itinerary days must match duration days");
    }

    itinerary.forEach((day, index) => {
      if (!day.day || day.day !== index + 1) {
        throw new Error("Invalid itinerary day sequence");
      }
    });

    const service = await TourService.create({
      tour: tourId,

      title: title.trim(),
      destinations,

      duration,

      basePrice,
      discountPrice,

      description: description?.trim() || "",
      features,
      images,

      itinerary,
      meta,
      maxPeople,

      isActive: true,
    });

    return service;
  } catch (error) {
    throw error;
  }
};

exports.getVendorTourServices = async (query = {}, vendorId) => {
  try {
    const { tourId, search, page = 1, limit = 10 } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const companies = await TourCompany.find({
      vendorId,
    })
      .select("_id")
      .lean();

    const tourIds = companies.map((c) => c._id);

    const filter = {
      tour: { $in: tourIds },
      
    };
 
    if (tourId) {
      filter.tour = tourId;
    }

    if (search) {
      filter.$or = [
        {
          title: { $regex: search, $options: "i" },
        },
        {
          description: { $regex: search, $options: "i" },
        },
      ];
    }

    const services = await TourService.find(filter)
      .populate("tour", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await TourService.countDocuments(filter);

    const formatted = services.map((s) => ({
      id: s._id,

      title: s.title,

      company: s.tour?.name || null,

      destinations: s.destinations,
      images: s.images,

      duration: `${s.duration.days}D / ${s.duration.nights}N`,

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
      pages: Math.ceil(total / Number(limit)),
      data: formatted,
    };
  } catch (error) {
    throw error;
  }
};

exports.getVendorTourServiceById = async (serviceId, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    const service = await TourService.findById(serviceId)
      .populate("tour", "name vendorId")
      .lean();

    if (!service) {
      throw new Error("Tour service not found");
    }

    if (service.tour.vendorId.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }

    const formatted = {
      id: service._id,

      company: {
        id: service.tour._id,
        name: service.tour.name,
      },

      title: service.title,

      destinations: service.destinations || [],

      duration: service.duration,

      pricing: {
        basePrice: service.basePrice,
        discountPrice: service.discountPrice,
      },

      description: service.description || "",

      features: service.features || [],

      images: service.images || [],

      itinerary: service.itinerary || [],

      meta: service.meta || {},

      maxPeople: service.maxPeople,

      isActive: service.isActive,

      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };

    return formatted;
  } catch (error) {
    throw error;
  }
};

exports.updateVendorTourService = async (serviceId, vendorId, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    const service = await TourService.findById(serviceId).populate(
      "tour",
      "vendorId",
    );

    if (!service) {
      throw new Error("Tour service not found");
    }

    if (service.tour.vendorId.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }

    if (data.basePrice !== undefined && data.basePrice < 0) {
      throw new Error("Invalid base price");
    }

    if (
      data.discountPrice !== undefined &&
      data.basePrice !== undefined &&
      data.discountPrice > data.basePrice
    ) {
      throw new Error("Discount cannot exceed base price");
    }

    //ITINERARY + DURATION VALIDATION
    if (data.itinerary || data.duration) {
      const finalDays = data.duration?.days || service.duration.days;
      const itinerary = data.itinerary || service.itinerary;

      if (itinerary.length !== finalDays) {
        throw new Error("Itinerary days must match duration days");
      }

      itinerary.forEach((day, index) => {
        if (!day.day || day.day !== index + 1) {
          throw new Error("Invalid itinerary sequence");
        }
      });

      service.itinerary = itinerary;
      service.duration = data.duration || service.duration;
    }

    const allowedFields = [
      "title",
      "destinations",
      "basePrice",
      "discountPrice",
      "description",
      "features",
      "images",
      "meta",
      "maxPeople",
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

exports.deleteVendorTourService = async (serviceId, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    const service = await TourService.findById(serviceId).populate(
      "tour",
      "vendorId",
    );

    if (!service) {
      throw new Error("Tour service not found");
    }

    if (service.tour.vendorId.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }

    // SOFT DELETE
    service.isActive = false;
    await service.save();

    // Hard delete
    // await TourService.findByIdAndDelete(serviceId);

    return;
  } catch (error) {
    throw error;
  }
};
