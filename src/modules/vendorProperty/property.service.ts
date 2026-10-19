import mongoose from "mongoose";
import Vendor from "../vendors/vendor.model.js";
import Hotel from "../hotels/hotel.model.js";
import CabCompany from "../cab/company/cab.model.js";
import BikeCompany from "../bike/company/bike.model.js";
import TourCompany from "../tour/company/tour.model.js";
import Adventure from "../adventure/category/adventure.model.js";
import logger from "../../shared/utils/logger.js";

const SERVICE_MODELS: Record<string, any> = {
  hotel: Hotel,
  cab: CabCompany,
  bike: BikeCompany,
  tour: TourCompany,
  adventure: Adventure,
};

const MAX_PROPERTIES = 10;

/**
 * List all properties owned by the vendor
 */
export const getVendorProperties = async (userId: any) => {
  try {
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) throw new Error("Vendor not found");
    if (vendor.status !== "approved") throw new Error("Vendor not approved");
    if (!vendor.serviceType) throw new Error("No service type set");

    const ServiceModel = SERVICE_MODELS[vendor.serviceType];
    if (!ServiceModel) throw new Error("Invalid service type");

    // Fetch ALL properties for this vendor
    const properties = await ServiceModel.find({
      vendorId: vendor._id,
    })
      .select("_id name description address city images location verificationStatus rating isActive createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return {
      activePropertyId: vendor.activePropertyId?.toString() || null,
      serviceType: vendor.serviceType,
      vendorId: vendor._id,
      properties: properties.map((p: any) => ({
        _id: p._id,
        name: p.name,
        description: (p.description || "").slice(0, 100),
        city:
          p.city ||
          p.address?.city ||
          p.location?.city ||
          "",
        image: p.images?.[0]?.url || null,
        isCurrentlyActive:
          p._id.toString() === vendor.activePropertyId?.toString(),
        verificationStatus: p.verificationStatus || "pending",
        isActive: p.isActive ?? false,
        rating:
          typeof p.rating === "number"
            ? p.rating
            : p.rating?.average || 0,
        createdAt: p.createdAt,
      })),
    };
  } catch (error) {
    logger.error("Service Error: getVendorProperties", error);
    throw error;
  }
};

/**
 * Add a new property (hotel/tour/etc) to an already-approved vendor
 */
export const addVendorProperty = async (userId: any, propertyData: any) => {
  try {
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) throw new Error("Vendor not found");
    if (vendor.status !== "approved")
      throw new Error("Only approved vendors can add new properties");
    if (!vendor.serviceType) throw new Error("No service type set");

    const ServiceModel = SERVICE_MODELS[vendor.serviceType];
    if (!ServiceModel) throw new Error("Invalid service type");

    // Rate limit — max properties per vendor
    const existingCount = await ServiceModel.countDocuments({
      vendorId: vendor._id,
    });

    if (existingCount >= MAX_PROPERTIES) {
      throw new Error(
        `Maximum ${MAX_PROPERTIES} properties allowed per vendor account`,
      );
    }

    let newProperty: any;

    // Build based on serviceType
    switch (vendor.serviceType) {
      case "hotel": {
        const city = (
          propertyData.city ||
          propertyData.hotelCity ||
          propertyData.address?.city ||
          ""
        ).trim();

        const location = propertyData.location || {
          type: "Point",
          coordinates: [72.8777, 19.076],
        };

        let addressObj: any;
        if (
          typeof propertyData.address === "object" &&
          propertyData.address !== null
        ) {
          addressObj = {
            buildingName:
              propertyData.address.buildingName ||
              propertyData.buildingName ||
              "",
            doorNumber:
              propertyData.address.doorNumber ||
              propertyData.doorNumber ||
              "",
            streetAddress:
              propertyData.address.streetAddress ||
              propertyData.address.address ||
              propertyData.hotelAddress ||
              "",
            areaName:
              propertyData.address.areaName || propertyData.areaName || "",
            city: propertyData.address.city || city || "Default City",
            district:
              propertyData.address.district || propertyData.district || "",
            state: propertyData.address.state || propertyData.state || "",
            postalCode:
              propertyData.address.postalCode ||
              propertyData.postalCode ||
              "",
            country:
              propertyData.address.country ||
              propertyData.country ||
              "India",
            countryCode:
              propertyData.address.countryCode ||
              propertyData.countryCode ||
              "IN",
            landmark:
              propertyData.address.landmark || propertyData.landmark || "",
            directions:
              propertyData.address.directions ||
              propertyData.directions ||
              "",
            formattedAddress:
              propertyData.address.formattedAddress ||
              propertyData.formattedAddress ||
              "",
            location: propertyData.address.location || location,
            placeId: propertyData.address.placeId || "",
            timeZone: propertyData.address.timeZone || "",
          };
        } else {
          const rawAddr = (
            propertyData.address ||
            propertyData.hotelAddress ||
            ""
          ).trim();
          addressObj = {
            streetAddress: rawAddr,
            city: city || "Default City",
            country: "India",
            countryCode: "IN",
            formattedAddress: rawAddr || city,
            location: location,
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

        newProperty = await Hotel.create({
          vendorId: vendor._id,
          name: (propertyData.name || propertyData.hotelName || "").trim(),
          description: (propertyData.description || "").trim(),
          address: addressObj,
          city: addressObj.city || city,
          location: addressObj.location || location,
          images: propertyData.images || [],
          documents: propertyData.documents || [],
          amenities: propertyData.amenities || [],
          accessibility: propertyData.accessibility || {},
          verificationStatus: "pending",
          isActive: false, // Admin must approve
          createdBy: userId,
        });
        break;
      }

      case "tour": {
        const city = (
          propertyData.location?.city ||
          propertyData.city ||
          ""
        ).trim();
        const state = (
          propertyData.location?.state ||
          propertyData.state ||
          ""
        ).trim();
        const country = (
          propertyData.location?.country ||
          propertyData.country ||
          "India"
        ).trim();

        const coords = {
          lat: propertyData.coordinates?.lat || propertyData.lat || null,
          lng: propertyData.coordinates?.lng || propertyData.lng || null,
        };

        let addressObj: any;
        if (
          typeof propertyData.address === "object" &&
          propertyData.address !== null
        ) {
          addressObj = {
            buildingName:
              propertyData.address.buildingName || "",
            doorNumber:
              propertyData.address.doorNumber || "",
            streetAddress:
              propertyData.address.streetAddress ||
              propertyData.address.address ||
              "",
            areaName: propertyData.address.areaName || "",
            city: propertyData.address.city || city || "Default City",
            district: propertyData.address.district || "",
            state: propertyData.address.state || state || "",
            postalCode: propertyData.address.postalCode || "",
            country: propertyData.address.country || country || "India",
            countryCode: propertyData.address.countryCode || "IN",
            landmark: propertyData.address.landmark || "",
            directions: propertyData.address.directions || "",
            formattedAddress: propertyData.address.formattedAddress || "",
            location: {
              type: "Point",
              coordinates: [
                coords.lng || 72.8777,
                coords.lat || 19.076,
              ],
            },
          };
        } else {
          const rawAddr = (propertyData.address || "").trim();
          addressObj = {
            streetAddress: rawAddr,
            city: city || "Default City",
            state: state,
            country: country || "India",
            countryCode: "IN",
            formattedAddress: rawAddr || city,
            location: {
              type: "Point",
              coordinates: [
                coords.lng || 72.8777,
                coords.lat || 19.076,
              ],
            },
          };
        }

        if (!addressObj.formattedAddress) {
          const parts = [
            addressObj.streetAddress,
            addressObj.areaName,
            addressObj.city,
            addressObj.state,
            addressObj.country,
          ].filter(Boolean);
          addressObj.formattedAddress = parts.join(", ");
        }

        newProperty = await TourCompany.create({
          vendorId: vendor._id,
          name: (propertyData.name || "").trim(),
          location: { city, state, country },
          address: addressObj,
          coordinates: coords,
          images: propertyData.images || [],
          documents: propertyData.documents || [],
          description: (propertyData.description || "").trim(),
          features: propertyData.features || [],
          tags: propertyData.tags || [],
          verificationStatus: "pending",
          isActive: false, // Admin must approve
          createdBy: userId,
        });
        break;
      }

      default:
        throw new Error(
          `Adding additional properties is not supported for service type: ${vendor.serviceType}`,
        );
    }

    return {
      _id: newProperty._id,
      name: newProperty.name,
      verificationStatus: newProperty.verificationStatus,
      isActive: newProperty.isActive,
      message:
        "Property added successfully. It will be visible after admin approval.",
    };
  } catch (error) {
    logger.error("Service Error: addVendorProperty", error);
    throw error;
  }
};

/**
 * Switch the active property the vendor is managing
 */
export const switchActiveProperty = async (
  userId: any,
  propertyId: string,
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      throw new Error("Invalid property ID");
    }

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) throw new Error("Vendor not found");
    if (vendor.status !== "approved") throw new Error("Vendor not approved");
    if (!vendor.serviceType) throw new Error("No service type set");

    const ServiceModel = SERVICE_MODELS[vendor.serviceType];
    if (!ServiceModel) throw new Error("Invalid service type");

    // Verify the property belongs to this vendor AND is active+verified
    const property = await ServiceModel.findOne({
      _id: propertyId,
      vendorId: vendor._id,
      isActive: true,
      verificationStatus: "verified",
    });

    if (!property) {
      throw new Error(
        "Property not found, not approved, or does not belong to this vendor",
      );
    }

    // Update vendor's activePropertyId
    vendor.activePropertyId = property._id;
    await vendor.save();

    return {
      activePropertyId: property._id,
      name: property.name,
      city:
        property.city ||
        property.address?.city ||
        property.location?.city ||
        "",
      serviceType: vendor.serviceType,
    };
  } catch (error) {
    logger.error("Service Error: switchActiveProperty", error);
    throw error;
  }
};

/**
 * Get details of the currently active property
 */
export const getActiveProperty = async (userId: any) => {
  try {
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) throw new Error("Vendor not found");
    if (!vendor.serviceType) throw new Error("No service type set");

    const ServiceModel = SERVICE_MODELS[vendor.serviceType];
    if (!ServiceModel) return null;

    // Auto-migrate: if no activePropertyId, find the first verified+active property
    if (!vendor.activePropertyId) {
      const firstProperty = await ServiceModel.findOne({
        vendorId: vendor._id,
        isActive: true,
        verificationStatus: "verified",
      });

      if (firstProperty) {
        vendor.activePropertyId = firstProperty._id;
        await vendor.save();
      } else {
        return null;
      }
    }

    const property = await ServiceModel.findById(vendor.activePropertyId).lean();
    if (!property) return null;

    return {
      _id: property._id,
      name: property.name,
      city:
        property.city ||
        property.address?.city ||
        property.location?.city ||
        "",
      image: property.images?.[0]?.url || null,
      verificationStatus: property.verificationStatus,
      isActive: property.isActive,
    };
  } catch (error) {
    logger.error("Service Error: getActiveProperty", error);
    throw error;
  }
};

/**
 * Admin: Get all pending additional properties (not the initial registration ones)
 * These are properties added by already-approved vendors that need admin review
 */
export const getPendingAdditionalProperties = async (query: any = {}) => {
  try {
    const { page = 1, limit = 10, serviceType } = query;
    const skip = (Number(page) - 1) * Number(limit);

    // Get all approved vendors
    const approvedVendorIds = await Vendor.find({ status: "approved" })
      .select("_id")
      .lean();
    const vendorIdList = approvedVendorIds.map((v: any) => v._id);

    if (vendorIdList.length === 0) {
      return { properties: [], total: 0, page: Number(page), limit: Number(limit) };
    }

    // Determine which models to query
    const typesToQuery = serviceType
      ? [serviceType]
      : ["hotel", "tour"];

    const allPending: any[] = [];

    for (const type of typesToQuery) {
      const Model = SERVICE_MODELS[type];
      if (!Model) continue;

      const pendingProps = await Model.find({
        vendorId: { $in: vendorIdList },
        verificationStatus: "pending",
        isActive: false,
      })
        .populate({
          path: "vendorId",
          select: "businessName businessEmail serviceType propertyId userId",
          populate: {
            path: "userId",
            select: "firstName lastName email",
          },
        })
        .sort({ createdAt: -1 })
        .lean();

      for (const prop of pendingProps) {
        // Check if this vendor already has at least one verified property
        // (if yes, this is an "additional" property, not the initial registration)
        const verifiedCount = await Model.countDocuments({
          vendorId: prop.vendorId?._id || prop.vendorId,
          verificationStatus: "verified",
          isActive: true,
        });

        if (verifiedCount > 0) {
          allPending.push({
            _id: prop._id,
            vendorId: prop.vendorId?._id || prop.vendorId,
            serviceType: type,
            name: prop.name,
            description: (prop.description || "").slice(0, 150),
            city:
              prop.city ||
              prop.address?.city ||
              prop.location?.city ||
              "",
            image: prop.images?.[0]?.url || null,
            verificationStatus: prop.verificationStatus,
            createdAt: prop.createdAt,
            vendor: {
              _id: prop.vendorId?._id,
              businessName: prop.vendorId?.businessName,
              businessEmail: prop.vendorId?.businessEmail,
              propertyId: prop.vendorId?.propertyId,
              ownerName: prop.vendorId?.userId
                ? `${prop.vendorId.userId.firstName || ""} ${prop.vendorId.userId.lastName || ""}`.trim()
                : "",
              ownerEmail: prop.vendorId?.userId?.email || "",
            },
          });
        }
      }
    }

    // Paginate
    const total = allPending.length;
    const paged = allPending.slice(skip, skip + Number(limit));

    return {
      properties: paged,
      total,
      page: Number(page),
      limit: Number(limit),
    };
  } catch (error) {
    logger.error("Service Error: getPendingAdditionalProperties", error);
    throw error;
  }
};

/**
 * Admin: Approve an additional property
 */
export const approveAdditionalProperty = async (
  serviceType: string,
  propertyId: string,
  adminId: any,
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      throw new Error("Invalid property ID");
    }

    const Model = SERVICE_MODELS[serviceType];
    if (!Model) throw new Error("Invalid service type");

    const property: any = await Model.findById(propertyId);
    if (!property) throw new Error("Property not found");

    if (property.verificationStatus === "verified" && property.isActive) {
      throw new Error("Property is already approved");
    }

    // Verify the vendor is approved
    const vendor = await Vendor.findById(property.vendorId);
    if (!vendor || vendor.status !== "approved") {
      throw new Error("Vendor is not approved");
    }

    // Approve the property
    property.verificationStatus = "verified";
    property.isActive = true;

    // Verify any attached documents
    if (property.documents && property.documents.length > 0) {
      property.documents = property.documents.map((doc: any) => ({
        ...(doc.toObject ? doc.toObject() : doc),
        isVerified: true,
      }));
    }

    await property.save();

    return {
      _id: property._id,
      name: property.name,
      verificationStatus: property.verificationStatus,
      isActive: property.isActive,
    };
  } catch (error) {
    logger.error("Service Error: approveAdditionalProperty", error);
    throw error;
  }
};

/**
 * Admin: Reject an additional property
 */
export const rejectAdditionalProperty = async (
  serviceType: string,
  propertyId: string,
  reason: string,
  adminId: any,
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      throw new Error("Invalid property ID");
    }

    const Model = SERVICE_MODELS[serviceType];
    if (!Model) throw new Error("Invalid service type");

    const property: any = await Model.findById(propertyId);
    if (!property) throw new Error("Property not found");

    property.verificationStatus = "rejected";
    property.isActive = false;
    await property.save();

    return {
      _id: property._id,
      name: property.name,
      verificationStatus: property.verificationStatus,
      isActive: property.isActive,
    };
  } catch (error) {
    logger.error("Service Error: rejectAdditionalProperty", error);
    throw error;
  }
};

// Service class wrapper
export class VendorPropertyService {
  getVendorProperties = getVendorProperties;
  addVendorProperty = addVendorProperty;
  switchActiveProperty = switchActiveProperty;
  getActiveProperty = getActiveProperty;
  getPendingAdditionalProperties = getPendingAdditionalProperties;
  approveAdditionalProperty = approveAdditionalProperty;
  rejectAdditionalProperty = rejectAdditionalProperty;
}

export const vendorPropertyService = new VendorPropertyService();
export default vendorPropertyService;
