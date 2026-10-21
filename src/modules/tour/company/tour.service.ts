import TourCompany from "./tour.model.js";
import logger from "../../../shared/utils/logger.js";
import Favorite from "../../favorites/favorite.model.js";

const optimizeCloudinary = (url: string, transform = "f_auto,q_auto") => {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com") || (!url.includes("/image/upload/") && !url.includes("/upload/"))) {
    return url;
  }
  const marker = url.includes("/image/upload/") ? "/image/upload/" : "/upload/";
  if (url.includes(`${marker}${transform}/`)) return url;
  return url.replace(marker, `${marker}${transform}/`);
};

export const createTourCompany = async (data: any, vendor: any) => {
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
    const city = (location?.city || data.city || data.hotelCity || "").trim();
    if (!name || !name.trim()) {
      throw new Error("Tour company name is required");
    }

    if (!city) {
      throw new Error("Location city is required");
    }

    const state = (location?.state || data.state || "").trim();
    const country = (location?.country || data.country || "India").trim();
    const coords = {
      lat: coordinates?.lat || data.lat || null,
      lng: coordinates?.lng || data.lng || null,
    };

    let addressObj;
    if (typeof address === "object" && address !== null) {
      addressObj = {
        buildingName: address.buildingName || data.buildingName || "",
        doorNumber: address.doorNumber || data.doorNumber || "",
        streetAddress: address.streetAddress || address.address || data.hotelAddress || "",
        areaName: address.areaName || data.areaName || "",
        city: address.city || city || "Default City",
        district: address.district || data.district || "",
        state: address.state || state || "",
        postalCode: address.postalCode || data.postalCode || "",
        country: address.country || country || "India",
        countryCode: address.countryCode || "IN",
        landmark: address.landmark || data.landmark || "",
        directions: address.directions || data.directions || "",
        formattedAddress: address.formattedAddress || "",
        location: {
          type: "Point",
          coordinates: [coords.lng || 72.8777, coords.lat || 19.0760],
        },
      };
    } else {
      const rawAddr = (address || data.hotelAddress || "").trim();
      addressObj = {
        buildingName: data.buildingName || "",
        doorNumber: data.doorNumber || "",
        streetAddress: rawAddr,
        areaName: data.areaName || "",
        city: city || "Default City",
        district: data.district || "",
        state: state || "",
        postalCode: data.postalCode || "",
        country: country || "India",
        countryCode: "IN",
        landmark: data.landmark || "",
        directions: data.directions || "",
        formattedAddress: rawAddr || city,
        location: {
          type: "Point",
          coordinates: [coords.lng || 72.8777, coords.lat || 19.0760],
        },
      };
    }

    if (!addressObj.formattedAddress) {
      const parts = [
        addressObj.doorNumber,
        addressObj.buildingName,
        addressObj.streetAddress,
        addressObj.areaName,
        addressObj.landmark,
        addressObj.city,
        addressObj.district,
        addressObj.state,
        addressObj.postalCode,
        addressObj.country,
      ].filter(Boolean);
      addressObj.formattedAddress = parts.join(", ");
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
          city: addressObj.city || city,
          state: addressObj.state || state,
          country: addressObj.country || country,
        },

        address: addressObj,

        coordinates: coords,

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
          city: addressObj.city || city,
          state: addressObj.state || state,
          country: addressObj.country || country,
        },

        address: addressObj,

        coordinates: coords,

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

    // Set activePropertyId to this tour company
    vendor.activePropertyId = tourCompany._id;

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

export const getAllTourCompanies = async (query: any = {}, userId: any = null) => {
  try {
    const TourService = (await import("../service/tourService.model.js")).default;
    const { city, search, featured, rank, page = 1, limit = 50 }: any = query;

    // STEP 1: Find all company IDs that have at least one active tour package (admin-approved)
    const companiesWithActiveTours = await TourService.distinct("tour", {
      isActive: true,
    });

    // If no companies have active tour packages, return empty
    if (!companiesWithActiveTours || companiesWithActiveTours.length === 0) {
      return {
        companies: [],
        total: 0,
        page: Math.max(1, Number(page) || 1),
        limit: Math.max(1, Number(limit) || 50),
      };
    }

    // STEP 2: Build filter — only admin-verified, active companies WITH at least one active tour package
    const filter: any = {
      _id: { $in: companiesWithActiveTours },
      verificationStatus: "verified",
      isActive: true,
    };

    if (city && city.trim()) {
      const cityRegex = { $regex: new RegExp(city.trim(), "i") };
      filter.$or = [
        { "location.city": cityRegex },
        { "address.city": cityRegex },
        { "address.areaName": cityRegex },
        { "address.district": cityRegex },
        { "address.streetAddress": cityRegex },
        { "address.landmark": cityRegex },
        { "address.formattedAddress": cityRegex },
        { "address.state": cityRegex },
      ];
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      const searchMatch = [
        { name: searchRegex },
        { "location.city": searchRegex },
        { "address.city": searchRegex },
        { "address.areaName": searchRegex },
        { description: searchRegex },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchMatch }];
        delete filter.$or;
      } else {
        filter.$or = searchMatch;
      }
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
      .select({
        name: 1,
        location: 1,
        address: 1,
        features: 1,
        rating: 1,
        isFeatured: 1,
        createdAt: 1,
        images: { $slice: 1 },
      })
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // STEP 3: Attach lowest tour service starting price and total ACTIVE tour count for each company
    const companyIds = companies.map((c) => c._id);
    let minPrices: any[] = [];
    if (companyIds.length > 0) {
      minPrices = await TourService.aggregate([
        { $match: { tour: { $in: companyIds }, isActive: true } },
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

    const priceMap: Record<string, number> = {};
    const countMap: Record<string, number> = {};
    minPrices.forEach((p: any) => {
      priceMap[p._id.toString()] = p.minPrice;
      countMap[p._id.toString()] = p.tourCount;
    });

    // STEP 4: Aggregate real review counts and ratings for each company
    const Review = (await import("../../reviews/review.model.js")).default;
    let reviewStats: any[] = [];
    if (companyIds.length > 0) {
      reviewStats = await Review.aggregate([
        {
          $match: {
            companyType: "tour",
            companyId: { $in: companyIds },
          },
        },
        {
          $group: {
            _id: "$companyId",
            averageRating: { $avg: "$rating" },
            reviewCount: { $sum: 1 },
          },
        },
      ]);
    }

    const reviewMap: Record<string, { average: number; count: number }> = {};
    reviewStats.forEach((r: any) => {
      reviewMap[r._id.toString()] = {
        average: Number((r.averageRating || 0).toFixed(1)),
        count: r.reviewCount || 0,
      };
    });

    let favoriteSet = new Set<string>();
    if (userId && companyIds.length > 0) {
      try {
        const favorites = await Favorite.find({
          user: userId,
          itemType: "tour",
          itemId: { $in: companyIds },
        })
          .select("itemId")
          .lean();
        favoriteSet = new Set(favorites.map((f: any) => f.itemId.toString()));
      } catch (err) {
        logger.error("Error fetching favorites in getAllTourCompanies", err);
      }
    }

    const formattedCompanies = companies.map((company: any) => {
      const companyIdStr = company._id.toString();
      const rawFirstImage =
        company.images?.[0]?.url ||
        (typeof company.images?.[0] === "string" ? company.images[0] : null) ||
        `https://api.dicebear.com/10.x/initials/svg?seed=${encodeURIComponent(company.name)}`;

      const optThumbnail = optimizeCloudinary(rawFirstImage, "f_auto,q_auto,w_800,c_limit");

      const realReview = reviewMap[companyIdStr];
      const avgRating = realReview
        ? realReview.average
        : (company.rating?.average ? Number(company.rating.average.toFixed(1)) : 0);
      const countReviews = realReview
        ? realReview.count
        : (company.rating?.count || 0);

      const featuresList = (company.features && company.features.length > 0)
        ? company.features.slice(0, 3)
        : ["guided_tours", "meals_included", "custom_packages"];

      const cityStr = company.location?.city || company.address?.city || "India";

      return {
        _id: company._id,
        name: company.name,
        city: cityStr,
        startingPrice: priceMap[companyIdStr] || 999,
        rating: {
          average: avgRating,
          count: countReviews,
        },
        numReviews: countReviews,
        features: featuresList,
        amenities: featuresList,
        thumbnail: optThumbnail,
        image: optThumbnail,
        totalTours: countMap[companyIdStr] || 0,
        isFavorite: favoriteSet.has(companyIdStr),
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

export const getTourCompanyById = async (id: any) => {
  try {
    const TourService = (await import("../service/tourService.model.js")).default;
    const company: any = await TourCompany.findOne({
      _id: id,
      isActive: true,
      verificationStatus: "verified",
    })
      .populate({
        path: "vendorId",
        select: "businessName businessEmail logo currentStep status",
      })
      .lean();

    if (!company) {
      throw new Error("Tour company not found");
    }

    const tours = await TourService.find({ tour: id, isActive: true }).lean();
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

export const getTourCompaniesGroupedByCity = async () => {
  try {
    const { companies } = await getAllTourCompanies({ limit: 100 });
    const grouped: Record<string, any[]> = {};

    companies.forEach((company: any) => {
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

// Get ranked tour companies for banner slideshows (paginated)
export const getRankedTourCompanies = async (rank: any, page: any = 1, limit: any = 10) => {
  try {
    const TourService = (await import("../service/tourService.model.js")).default;

    if (!rank || !["A", "B", "C"].includes(rank)) {
      return { items: [], total: 0, page: 1, limit: 10, hasMore: false };
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);
    const skip = (pageNum - 1) * limitNum;

    // Only companies that have at least one active tour package
    const companiesWithActiveTours = await TourService.distinct("tour", {
      isActive: true,
    });

    if (!companiesWithActiveTours || companiesWithActiveTours.length === 0) {
      return { items: [], total: 0, page: pageNum, limit: limitNum, hasMore: false };
    }

    const filter: any = {
      _id: { $in: companiesWithActiveTours },
      rank,
      isActive: true,
      verificationStatus: "verified",
    };

    const total = await TourCompany.countDocuments(filter);

    if (total === 0) {
      return { items: [], total: 0, page: pageNum, limit: limitNum, hasMore: false };
    }

    const companies = await TourCompany.find(filter)
      .populate({
        path: "vendorId",
        select: "businessName logo",
      })
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const items = companies.map((company: any) => {
      const bannerImg =
        company.advertisementImage?.url ||
        company.images?.[0]?.url ||
        company.logo?.url ||
        company.vendorId?.logo?.url ||
        `https://api.dicebear.com/10.x/initials/svg?seed=${encodeURIComponent(company.name)}`;

      return {
        _id: company._id,
        name: company.name,
        city: company.location?.city || "India",
        image: bannerImg,
      };
    });

    return {
      items,
      total,
      page: pageNum,
      limit: limitNum,
      hasMore: skip + limitNum < total,
    };
  } catch (error) {
    logger.error("Service Error: getRankedTourCompanies", error);
    throw error;
  }
};

export class TourCompanyService {
  async createTourCompany(data: any, vendor: any) {
    return createTourCompany(data, vendor);
  }

  async getAllTourCompanies(query: any = {}, userId: any = null) {
    return getAllTourCompanies(query, userId);
  }

  async getTourCompanyById(id: any) {
    return getTourCompanyById(id);
  }

  async getTourCompaniesGroupedByCity() {
    return getTourCompaniesGroupedByCity();
  }

  async getRankedTourCompanies(rank: any, page: any = 1, limit: any = 10) {
    return getRankedTourCompanies(rank, page, limit);
  }
}

export const tourCompanyService = new TourCompanyService();

export default tourCompanyService;

