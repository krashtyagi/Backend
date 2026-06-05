const mongoose = require("mongoose");
const Adventure = require("./adventure.model");
const Service = require("../service/service.model");
const slugify = require("slugify");
const Tax = require("../../admin/tax/tax.model");
const logger = require("../../../shared/utils/logger");
const Favorite = require("../../favorites/favorite.model");

//helper function to attach isFavorite flag to companies/services
const attachFavoriteFlag = async (items, userId, itemType) => {
  if (!userId || items.length === 0) {
    items.forEach((item) => (item.isFavorite = false));
    return items;
  }

  const itemIds = items.map((i) => i._id);

  const favorites = await Favorite.find({
    user: userId,
    itemType,
    itemId: { $in: itemIds },
  }).select("itemId");

  const favoriteSet = new Set(favorites.map((f) => f.itemId.toString()));

  items.forEach((item) => {
    item.isFavorite = favoriteSet.has(item._id.toString());
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

exports.searchAdventures = async (query = {}, userId = null) => {
  try {
    const { city } = query;

    if (!city) {
      throw new Error("City is required");
    }

    const adventures = await Adventure.find({
      "location.city": city,
      isActive: true,
    })
      .select("_id category")
      .lean();

    if (!adventures.length) return [];

    const categoryMap = {};

    adventures.forEach((adv) => {
      if (!categoryMap[adv.category]) {
        categoryMap[adv.category] = [];
      }
      categoryMap[adv.category].push(adv._id);
    });

    const categoryConfig = {
      rafting: "River Rafting",
      paragliding: "Paragliding",
      bungee: "Bungee Jumping",
      trekking: "Trekking",
    };

    const results = await Promise.all(
      Object.keys(categoryMap).map(async (category) => {
        const adventureIds = categoryMap[category];

        const minService = await Service.find({
          adventure: { $in: adventureIds },
          isActive: true,
        })
          .sort({ basePrice: 1 })
          .select("basePrice")
          .limit(1)
          .lean();

        const startingPrice = minService[0]?.basePrice || null;

        return {
          category,
          title: categoryConfig[category] || category,
          startingPrice,
          serviceType: "adventure",
        };
      }),
    );

    return results;
  } catch (error) {
    throw error;
  }
};

exports.getAdventures = async (query = {}, userId = null) => {
  try {
    const { category, city } = query;

    if (!category || !city) {
      throw new Error("Category and city are required");
    }

    const adventures = await Adventure.aggregate([
      {
        $match: {
          category,
          "location.city": city,
          isActive: true,
        },
      },

      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "adventure",
          as: "services",
        },
      },

      {
        $match: {
          "services.0": { $exists: true },
        },
      },

      {
        $addFields: {
          priceStart: {
            $min: "$services.basePrice",
          },
        },
      },

      {
        $project: {
          name: 1,
          category: 1,
          city: "$location.city",

          description: 1,
          features: { $slice: ["$features", 3] },

          rating: "$rating.average",
          reviews: "$rating.count",

          image: { $arrayElemAt: ["$images", 0] },

          priceStart: 1,
        },
      },

      {
        $sort: {
          priceStart: 1,
        },
      },
    ]);

    const formattedAdventures = adventures.map((adv) => ({
      ...adv,
      serviceType: "adventure",
    }));

    return await attachFavoriteFlag(formattedAdventures, userId, "adventure");
  } catch (error) {
    throw error;
  }
};

exports.getAdventureDetails = async (id, userId = null) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid adventure id");
    }

    const adventure = await Adventure.findOne({
      _id: id,
      isActive: true,
    })
      .select("name category location description images rating")
      .lean();

    if (!adventure) {
      throw new Error("Adventure not found");
    }

    const services = await Service.find({
      adventure: id,
      isActive: true,
    })
      .select("title type basePrice discountPrice meta features itinerary")
      .sort({ basePrice: 1 }) // cheapest first
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
        ...service,
        serviceType: "adventure",
        taxPercentage,
        totalTax,
        totalPriceWithTax,
      };
    });

    const isFavorite = await checkIsFavorite(adventure._id, userId, "adventure");

    const formattedAdventure = {
      _id: adventure._id,
      serviceType: "adventure",
      isFavorite,
      name: adventure.name,
      category: adventure.category,
      city: adventure.location?.city,
      description: adventure.description,
      rating: adventure.rating?.average || 0,
      reviews: adventure.rating?.count || 0,
      images: adventure.images || [],
    };

    return {
      adventure: formattedAdventure,
      services: formattedServices,
      isFavorite,
    };
  } catch (error) {
    throw error;
  }
};

exports.createAdventure = async (data, vendor) => {
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
      category,
      city,
      state,
      country,
      address,
      description,
      images = [],
      documents = [],
      features = [],
      coordinates,
    } = data;

    // VALIDATIONS
    if (!name || !name.trim()) {
      throw new Error("Adventure name is required");
    }

    if (!category) {
      throw new Error("Adventure category is required");
    }

    if (!city) {
      throw new Error("City is required");
    }

   

    // CHECK EXISTING ADVENTURE
    let adventure = await Adventure.findOne({
      vendorId: vendor._id,
    });

    if (adventure) {
      // UPDATE EXISTING
      Object.assign(adventure, {
        name: name.trim(),


        category,

        location: {
          city: city.trim(),

          state: state || "",

          country: country || "India",
        },

        address: address?.trim() || "",

        coordinates: {
          lat: coordinates?.lat || null,

          lng: coordinates?.lng || null,
        },

        description: description?.trim() || "",

        images,

        documents,

        features,

        verificationStatus: "pending",
      });

      await adventure.save();
    } else {
      // CREATE NEW
      adventure = await Adventure.create({
        name: name.trim(),


        category,

        location: {
          city: city.trim(),

          state: state || "",

          country: country || "India",
        },

        address: address?.trim() || "",

        coordinates: {
          lat: coordinates?.lat || null,

          lng: coordinates?.lng || null,
        },

        description: description?.trim() || "",

        images,

        documents,

        features,

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

    return {
      _id: adventure._id,

      name: adventure.name,

      category: adventure.category,

      city: adventure.location?.city,
    };
  } catch (error) {
    throw error;
  }
};

exports.getVendorAdventures = async (vendorId) => {
  try {
    const adventures = await Adventure.aggregate([
      {
        $match: {
          vendorId: vendorId,
          isActive: true,
        },
      },

      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "adventure",
          as: "services",
        },
      },
      

      {
        $addFields: {
          priceStart: {
            $min: "$services.basePrice",
          },
        },
      },

      {
        $project: {
          name: 1,
          category: 1,
          city: "$location.city",
          image: {
            $arrayElemAt: ["$images.url", 0],
          },
          priceStart: 1,
          createdAt: 1,
        },
      },

      {
        $sort: { createdAt: -1 },
      },
    ]);

    return adventures;
  } catch (error) {
    throw error;
  }
};

exports.getVendorAdventureDetails = async (id, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid adventure id");
    }

    const adventure = await Adventure.findOne({
      _id: id,
      vendorId: vendorId,
      isActive: true,
    })
      .select("name category location address description images features")
      .lean();

    if (!adventure) {
      throw new Error("Adventure not found or unauthorized");
    }

    const services = await Service.find({
      adventure: id,
      isActive: true,
    })
      .select("title type basePrice discountPrice meta features itinerary")
      .sort({ createdAt: -1 })
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
        ...service,
        taxPercentage,
        totalTax,
        totalPriceWithTax,
      };
    });

    const formattedAdventure = {
      _id: adventure._id,
      name: adventure.name,
      category: adventure.category,
      city: adventure.location?.city,
      state: adventure.location?.state,
      country: adventure.location?.country,
      address: adventure.address,
      description: adventure.description,
      images: adventure.images || [],
      features: adventure.features || [],
    };

    return {
      adventure: formattedAdventure,
      services: formattedServices,
    };
  } catch (error) {
    throw error;
  }
};

exports.updateAdventure = async (id, data, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid adventure id");
    }

    const adventure = await Adventure.findOne({
      _id: id,
      vendorId: vendorId,
      isActive: true,
    });

    if (!adventure) {
      throw new Error("Adventure not found or unauthorized");
    }

    const {
      name,
      category,
      city,
      state,
      country,
      address,
      description,
      images,
      features,
    } = data;

    if (name !== undefined) adventure.name = name;
    if (category !== undefined) adventure.category = category;

    if (city || state || country) {
      adventure.location = {
        city: city || adventure.location?.city,
        state: state || adventure.location?.state,
        country: country || adventure.location?.country,
      };
    }

    if (address !== undefined) adventure.address = address;
    if (description !== undefined) adventure.description = description;
    if (images !== undefined) adventure.images = images;
    if (features !== undefined) adventure.features = features;

    await adventure.save();

    return {
      _id: adventure._id,
      name: adventure.name,
      category: adventure.category,
      city: adventure.location?.city,
      updatedAt: adventure.updatedAt,
    };
  } catch (error) {
    throw error;
  }
};

exports.deleteAdventure = async (id, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid adventure id");
    }

    const adventure = await Adventure.findOne({
      _id: id,
      vendorId: vendorId,
      isActive: true,
    });

    if (!adventure) {
      throw new Error("Adventure not found or unauthorized");
    }

    //Soft delete all services of this adventure
    await Service.updateMany({ adventure: id }, { isActive: false });

    //Soft delete adventure
    adventure.isActive = false;
    await adventure.save();

    return true;
  } catch (error) {
    throw error;
  }
};
