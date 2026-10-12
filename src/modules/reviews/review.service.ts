import mongoose from "mongoose";
import Review from "./review.model.js";

import Hotel from "../hotels/hotel.model.js";
import Booking from "../bookings/booking.model.js";

import Adventure from "../adventure/category/adventure.model.js";
import AdventureService from "../adventure/service/service.model.js";

import BikeCompany from "../bike/company/bike.model.js";
import BikeService from "../bike/service/bikeService.model.js";

import CabCompany from "../cab/company/cab.model.js";
import CabService from "../cab/service/cabService.model.js";

import TourCompany from "../tour/company/tour.model.js";
import TourService from "../tour/service/tourService.model.js";

import GenericBooking from "../multiServiceBookings/booking.model.js";

import logger from "../../shared/utils/logger.js";
import { updateCompanyRating } from "./helpers/updateCompanyRating.js";

export const getCompanyReviews = async (companyType: string, companyId: any, query: any = {}) => {
  try {
    const allowedTypes = ["hotel", "adventure", "tour", "cab", "bike"];

    if (!allowedTypes.includes(companyType)) {
      throw new Error("Invalid company type");
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      throw new Error("Invalid company id");
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const [reviews, total, stats] = await Promise.all([
      Review.find({
        companyType,
        companyId,
      })
        .populate("userId", "firstName lastName avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Review.countDocuments({
        companyType,
        companyId,
      }),

      Review.aggregate([
        {
          $match: {
            companyType,
            companyId: new mongoose.Types.ObjectId(companyId),
          },
        },
        {
          $group: {
            _id: null,
            averageRating: {
              $avg: "$rating",
            },
            totalReviews: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);

    return {
      reviews,

      summary: {
        averageRating: stats[0]?.averageRating?.toFixed(1) || 0,

        totalReviews: stats[0]?.totalReviews || 0,
      },

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getUserReviews = async (userId: any) => {
  try {
    // Already submitted reviews
    const submittedReviews = await Review.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    const reviewedBookingIds = submittedReviews.map((review: any) =>
      review.bookingId.toString(),
    );

    // Hotel bookings
    const hotelBookings: any[] = await Booking.find({
      userId,
      status: "completed",
    })
      .populate("hotelId", "name images rating")
      .lean();

    // Generic bookings
    const genericBookings: any[] = await GenericBooking.find({
      userId,
      status: "completed",
    }).lean();

    const pendingHotelReviews = hotelBookings
      .filter((booking: any) => !reviewedBookingIds.includes(booking._id.toString()))
      .map((booking: any) => ({
        bookingId: booking._id,

        companyId: booking.hotelId?._id,

        companyType: "hotel",

        companyName: booking.hotelId?.name || "",

        bookingReference: booking.bookingReference,

        bookingDate: booking.createdAt,
      }));

    const pendingGenericReviews = genericBookings
      .filter((booking: any) => !reviewedBookingIds.includes(booking._id.toString()))
      .map((booking: any) => ({
        bookingId: booking._id,

        companyId: booking.serviceId,

        companyType: booking.serviceType,

        bookingReference: booking.bookingReference,

        bookingDate: booking.bookingDate,
      }));

    return {
      pendingReviews: [...pendingHotelReviews, ...pendingGenericReviews],

      submittedReviews,
    };
  } catch (error) {
    logger.error("Service Error: getUserReviews", error);

    throw error;
  }
};

export const createReview = async (userId: any, body: any) => {
  try {
    const { bookingId, rating, comment } = body;

    if (!bookingId) {
      throw new Error("Booking ID is required");
    }

    if (!rating || rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    if (!comment?.trim()) {
      throw new Error("Comment is required");
    }

    const existingReview = await Review.findOne({
      bookingId,
    });

    if (existingReview) {
      throw new Error("Review already submitted");
    }

    // HOTEL BOOKING
    const hotelBooking = await Booking.findOne({
      _id: bookingId,
      userId,
      status: "completed",
    });

    if (hotelBooking) {
      const hotel = await Hotel.findById(hotelBooking.hotelId);

      if (!hotel) {
        throw new Error("Hotel not found");
      }

      const review = await Review.create({
        userId,

        bookingId,

        companyId: hotel._id,
        companyName: hotel.name,
        companyType: "hotel",

        vendorId: hotel.vendorId,

        rating,

        comment,
      });

      await updateCompanyRating("hotel", hotel._id);

      return {
        message: "Review submitted successfully",
        review,
      };
    }

    // GENERIC BOOKING
    const booking: any = await GenericBooking.findOne({
      _id: bookingId,
      userId,
      status: "completed",
    });

    if (!booking) {
      throw new Error("Completed booking not found");
    }

    let companyId: any;
    let vendorId: any;
    let companyName: any;

    switch (booking.serviceType) {
      case "adventure": {
        const service: any = await AdventureService.findById(booking.serviceId);

        if (!service) {
          throw new Error("Adventure service not found");
        }

        const adventure = await Adventure.findById(service.adventure);

        if (!adventure) {
          throw new Error("Adventure company not found");
        }

        companyId = adventure._id;
        companyName = adventure.name;
        vendorId = adventure.vendorId;

        break;
      }

      case "bike": {
        const service: any = await BikeService.findById(booking.serviceId);

        if (!service) {
          throw new Error("Bike service not found");
        }

        const bike = await BikeCompany.findById(service.bike);

        if (!bike) {
          throw new Error("Bike company not found");
        }

        companyId = bike._id;
        companyName = bike.name;
        vendorId = bike.vendorId;

        break;
      }

      case "cab": {
        const service: any = await CabService.findById(booking.serviceId);

        if (!service) {
          throw new Error("Cab service not found");
        }

        const cab = await CabCompany.findById(service.cab);

        if (!cab) {
          throw new Error("Cab company not found");
        }

        companyId = cab._id;
        companyName = cab.name;
        vendorId = cab.vendorId;

        break;
      }

      case "tour": {
        const service: any = await TourService.findById(booking.serviceId);

        if (!service) {
          throw new Error("Tour service not found");
        }

        const tour = await TourCompany.findById(service.tour);

        if (!tour) {
          throw new Error("Tour company not found");
        }

        companyId = tour._id;
        companyName = tour.name;
        vendorId = tour.vendorId;

        break;
      }

      default:
        throw new Error("Invalid service type");
    }

    const review = await Review.create({
      userId,

      bookingId,

      companyId,

      companyName,

      companyType: booking.serviceType,

      vendorId,

      rating,

      comment,
    });

    await updateCompanyRating(booking.serviceType, companyId);

    return {
      message: "Review submitted successfully",
      review,
    };
  } catch (error) {
    logger.error("Service Error: createReview", error);

    throw error;
  }
};

export const updateReview = async (userId: any, reviewId: any, body: any) => {
  try {
    const { rating, comment } = body;

    const review = await Review.findOne({
      _id: reviewId,
      userId,
    });

    if (!review) {
      throw new Error("Review not found");
    }

    if (review.vendorReply?.message) {
      throw new Error("Review cannot be updated after vendor reply");
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }

    if (comment !== undefined && (!comment || !comment.trim())) {
      throw new Error("Comment cannot be empty");
    }

    if (rating) {
      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    await updateCompanyRating(review.companyType, review.companyId);

    return {
      message: "Review updated successfully",
      review,
    };
  } catch (error) {
    logger.error("Service Error: updateReview", error);

    throw error;
  }
};

export const getVendorReviews = async (vendorId: any, query: any = {}) => {
  try {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const [reviews, total, stats] = await Promise.all([
      Review.find({
        vendorId,
      })
        .populate("userId", "firstName lastName avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Review.countDocuments({
        vendorId,
      }),

      Review.aggregate([
        {
          $match: {
            vendorId,
          },
        },
        {
          $group: {
            _id: null,
            averageRating: {
              $avg: "$rating",
            },
            totalReviews: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);

    return {
      summary: {
        totalReviews: stats[0]?.totalReviews || 0,

        averageRating: Number((stats[0]?.averageRating || 0).toFixed(1)),
      },

      reviews,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    logger.error("Service Error: getVendorReviews", error);

    throw error;
  }
};

export const vendorReply = async (vendorId: any, reviewId: any, body: any) => {
  try {
    const { message } = body;

    if (!message?.trim()) {
      throw new Error("Reply message is required");
    }

    const review = await Review.findOne({
      _id: reviewId,
      vendorId,
    });

    if (!review) {
      throw new Error("Review not found");
    }

    if (review.vendorReply?.message) {
      throw new Error("Reply already submitted");
    }

    review.vendorReply = {
      message: message.trim(),
      repliedAt: new Date(),
    };

    await review.save();

    return {
      message: "Reply submitted successfully",
      review,
    };
  } catch (error) {
    logger.error("Service Error: vendorReply", error);

    throw error;
  }
};

export class ReviewService {
  async getCompanyReviews(companyType: string, companyId: any, query: any = {}) {
    return getCompanyReviews(companyType, companyId, query);
  }

  async getUserReviews(userId: any) {
    return getUserReviews(userId);
  }

  async createReview(userId: any, body: any) {
    return createReview(userId, body);
  }

  async updateReview(userId: any, reviewId: any, body: any) {
    return updateReview(userId, reviewId, body);
  }

  async getVendorReviews(vendorId: any, query: any = {}) {
    return getVendorReviews(vendorId, query);
  }

  async vendorReply(vendorId: any, reviewId: any, body: any) {
    return vendorReply(vendorId, reviewId, body);
  }
}

export const reviewService = new ReviewService();

export default reviewService;

