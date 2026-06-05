const mongoose = require("mongoose");
const Review = require("./review.model");

const Hotel = require("../hotels/hotel.model");
const Booking = require("../bookings/booking.model");

const Adventure = require("../adventure/category/adventure.model");
const AdventureService = require("../adventure/service/service.model");

const BikeCompany = require("../bike/company/bike.model");
const BikeService = require("../bike/service/bikeService.model");

const CabCompany = require("../cab/company/cab.model");
const CabService = require("../cab/service/cabService.model");

const TourCompany = require("../tour/company/tour.model");
const TourService = require("../tour/service/tourService.model");

const GenericBooking = require("../multiServiceBookings/booking.model");

const logger = require("../../shared/utils/logger");
const { updateCompanyRating } = require("./helpers/updateCompanyRating");

exports.getCompanyReviews = async (companyType, companyId, query) => {
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

exports.getUserReviews = async (userId) => {
  try {
    // Already submitted reviews
    const submittedReviews = await Review.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    const reviewedBookingIds = submittedReviews.map((review) =>
      review.bookingId.toString(),
    );

    // Hotel bookings
    const hotelBookings = await Booking.find({
      userId,
      status: "completed",
    })
      .populate("hotelId", "name images rating")
      .lean();

    // Generic bookings
    const genericBookings = await GenericBooking.find({
      userId,
      status: "completed",
    }).lean();

    const pendingHotelReviews = hotelBookings
      .filter((booking) => !reviewedBookingIds.includes(booking._id.toString()))
      .map((booking) => ({
        bookingId: booking._id,

        companyId: booking.hotelId?._id,

        companyType: "hotel",

        companyName: booking.hotelId?.name || "",

        bookingReference: booking.bookingReference,

        bookingDate: booking.createdAt,
      }));

    const pendingGenericReviews = genericBookings
      .filter((booking) => !reviewedBookingIds.includes(booking._id.toString()))
      .map((booking) => ({
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

exports.createReview = async (userId, body) => {
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
    const booking = await GenericBooking.findOne({
      _id: bookingId,
      userId,
      status: "completed",
    });

    if (!booking) {
      throw new Error("Completed booking not found");
    }

    let companyId;
    let vendorId;
    let companyName;

    switch (booking.serviceType) {
      case "adventure": {
        const service = await AdventureService.findById(booking.serviceId);

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
        const service = await BikeService.findById(booking.serviceId);

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
        const service = await CabService.findById(booking.serviceId);

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
        const service = await TourService.findById(booking.serviceId);

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

exports.updateReview = async (userId, reviewId, body) => {
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

exports.getVendorReviews = async (vendorId, query) => {
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

exports.vendorReply = async (vendorId, reviewId, body) => {
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
