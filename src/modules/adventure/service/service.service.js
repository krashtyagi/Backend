const Adventure = require("../category/adventure.model");
const Service = require("../service/service.model");
const mongoose = require("mongoose");
const Tax = require("../../admin/tax/tax.model");
const Favorite = require("../../favorites/favorite.model");

const checkIsFavorite = async (itemId, userId, itemType) => {
  if (!userId || !itemId) return false;
  const fav = await Favorite.findOne({
    user: userId,
    itemType,
    itemId,
  }).select("_id");
  return !!fav;
};

exports.getServiceDetails = async (id, userId = null) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid service id");
    }

    const service = await Service.findOne({
      _id: id,
      isActive: true,
    })
      .populate({
        path: "adventure",
        select: `
          name
          category
          location
          images
        `,
      })
      .lean();

    if (!service) {
      throw new Error("Service not found");
    }

    const taxDoc = await Tax.findOne({
      isActive: true,
    }).lean();

    const taxPercentage = taxDoc?.taxPercentage || 0;

    const effectivePrice =
      service.discountPrice > 0 ? service.discountPrice : service.basePrice;

    const discountAmount = service.basePrice - effectivePrice;

    const discountPercentage =
      service.discountPrice > 0
        ? Math.round((discountAmount / service.basePrice) * 100)
        : 0;

    const taxAmount = Number(
      ((effectivePrice * taxPercentage) / 100).toFixed(2),
    );

    const finalPrice = Number((effectivePrice + taxAmount).toFixed(2));

    const isFavorite = await checkIsFavorite(
      service.adventure?._id,
      userId,
      "adventure",
    );

    return {
      isFavorite,
      adventure: {
        _id: service.adventure?._id,
        serviceType: "adventure",
        isFavorite,

        name: service.adventure?.name,

        category: service.adventure?.category,

        city: service.adventure?.location?.city,

        image: service.adventure?.images?.[0] || null,
      },

      service: {
        _id: service._id,
        serviceType: "adventure",
        isFavorite,

        title: service.title,

        type: service.type,

        pricing: {
          basePrice: service.basePrice,

          discountPrice: service.discountPrice,

          effectivePrice,

          discountAmount,

          discountPercentage,

          taxPercentage,

          taxAmount,

          finalPrice,
        },

        meta: {
          distance: service.meta?.distance || null,

          duration: service.meta?.duration || null,

          days: service.meta?.days || null,

          nights: service.meta?.nights || null,
        },

        features: service.features || [],

        totalFeatures: service.features?.length || 0,

        itinerary: service.itinerary || [],

        hasItinerary: service.itinerary?.length > 0,

        createdAt: service.createdAt,
      },
    };
  } catch (error) {
    throw error;
  }
};

exports.getVendorServices = async (vendorId) => {
  try {
    const services = await Service.find({
      isActive: true,
    })
      .populate({
        path: "adventure",
        match: {
          vendorId,
          isActive: true,
        },
        select: "name category",
      })
      .sort({ createdAt: -1 })
      .lean();

    const filteredServices = services.filter((service) => service.adventure);

    return filteredServices.map((service) => ({
      id: service._id,

      adventure: {
        id: service.adventure._id,
        name: service.adventure.name,
        category: service.adventure.category,
      },

      title: service.title,

      type: service.type,

      pricing: {
        basePrice: service.basePrice,
        discountPrice: service.discountPrice,
      },

      meta: service.meta || {},

      isActive: service.isActive,

      createdAt: service.createdAt,
    }));
  } catch (error) {
    throw error;
  }
};

exports.getVendorServiceById = async (serviceId, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }

    const service = await Service.findById(serviceId)
      .populate({
        path: "adventure",
        select: "name category vendorId",
      })
      .lean();

    if (!service) {
      throw new Error("Service not found");
    }

    if (
      !service.adventure ||
      service.adventure.vendorId.toString() !== vendorId.toString()
    ) {
      throw new Error("Unauthorized access");
    }

    return {
      id: service._id,

      adventure: {
        id: service.adventure._id,
        name: service.adventure.name,
        category: service.adventure.category,
      },

      title: service.title,

      type: service.type,

      pricing: {
        basePrice: service.basePrice,
        discountPrice: service.discountPrice,
      },

      meta: service.meta || {},

      features: service.features || [],

      images: service.images || [],

      itinerary: service.itinerary || [],

      isActive: service.isActive,

      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
  } catch (error) {
    throw error;
  }
};

exports.createService = async (data, vendorId) => {
  try {
    const {
      adventureId,
      title,
      type,
      basePrice,
      discountPrice,
      meta,
      features,
      images,
      itinerary,
    } = data;

    if (!adventureId || !title || !type || !basePrice) {
      throw new Error("Adventure, title, type and basePrice are required");
    }

    const adventure = await Adventure.findOne({
      _id: adventureId,
      vendorId: vendorId,
      isActive: true,
    });

    if (!adventure) {
      throw new Error("Adventure not found or unauthorized");
    }

    //TYPE BASED VALIDATION
    if (type === "distance") {
      if (!meta?.distance) {
        throw new Error("Distance is required for distance type");
      }
    }

    if (type === "time") {
      if (!meta?.duration) {
        throw new Error("Duration is required for time type");
      }
    }

    if (type === "package") {
      if (!meta?.days || !meta?.nights) {
        throw new Error("Days and nights are required for package");
      }

      if (!itinerary || !itinerary.length) {
        throw new Error("Itinerary is required for package");
      }
    }

    const service = await Service.create({
      adventure: adventureId,
      title,
      type,
      basePrice,
      discountPrice,
      meta,
      features,
      images,
      itinerary,
    });

    return service;
  } catch (error) {
    throw error;
  }
};

exports.updateService = async (id, data, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid service id");
    }

    const service = await Service.findById(id);
    if (!service) {
      throw new Error("Service not found");
    }

    const adventure = await Adventure.findOne({
      _id: service.adventure,
      vendorId: vendorId,
      isActive: true,
    });

    if (!adventure) {
      throw new Error("Unauthorized access");
    }

    const {
      title,
      type,
      basePrice,
      discountPrice,
      meta,
      features,
      images,
      itinerary,
    } = data;

    if (type === "distance") {
      if (!meta?.distance) {
        throw new Error("Distance is required");
      }
    }

    if (type === "time") {
      if (!meta?.duration) {
        throw new Error("Duration is required");
      }
    }

    if (type === "package") {
      if (!meta?.days || !meta?.nights) {
        throw new Error("Days and nights required");
      }

      if (!itinerary || !itinerary.length) {
        throw new Error("Itinerary required");
      }
    }

    //Update fields (only if provided)
    if (title !== undefined) service.title = title;
    if (type !== undefined) service.type = type;
    if (basePrice !== undefined) service.basePrice = basePrice;
    if (discountPrice !== undefined) service.discountPrice = discountPrice;
    if (meta !== undefined) service.meta = meta;
    if (features !== undefined) service.features = features;
    if (images !== undefined) service.images = images;
    if (itinerary !== undefined) service.itinerary = itinerary;

    await service.save();

    return service;
  } catch (error) {
    throw error;
  }
};

exports.deleteService = async (id, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid service id");
    }

    const service = await Service.findById(id);
    if (!service) {
      throw new Error("Service not found");
    }

    const adventure = await Adventure.findOne({
      _id: service.adventure,
      vendorId: vendorId,
      isActive: true,
    });

    if (!adventure) {
      throw new Error("Unauthorized access");
    }

    // Delete (soft delete)
    service.isActive = false;
    await service.save();

    //Hard delete
    // await Service.findByIdAndDelete(id);

    return true;
  } catch (error) {
    throw error;
  }
};
