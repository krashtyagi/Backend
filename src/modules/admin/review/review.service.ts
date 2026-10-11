import mongoose from "mongoose";
import Review from "../../reviews/review.model";
import { updateCompanyRating } from "../../reviews/helpers/updateCompanyRating";
import logger from "../../../shared/utils/logger";

export const getReviewStats = async () => {
  try {
    const result: any = await Review.aggregate([
      {
        $facet: {
          totalReviews: [
            {
              $count: "count",
            },
          ],

          avgRating: [
            {
              $group: {
                _id: null,
                avg: {
                  $avg: "$rating",
                },
              },
            },
          ],

          lowRatings: [
            {
              $match: {
                rating: { $lte: 2 },
              },
            },
            {
              $count: "count",
            },
          ],

          noReply: [
            {
              $match: {
                $or: [
                  {
                    "vendorReply.message": null,
                  },
                  {
                    "vendorReply.message": "",
                  },
                ],
              },
            },
            {
              $count: "count",
            },
          ],

          flaggedReviews: [
            {
              $match: {
                isFlagged: true,
              },
            },
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    const stats = result[0];

    return {
      totalReviews: stats.totalReviews[0]?.count || 0,

      avgRating: Number(stats.avgRating[0]?.avg?.toFixed(1)) || 0,

      lowRatings: stats.lowRatings[0]?.count || 0,

      noReply: stats.noReply[0]?.count || 0,

      flaggedReviews: stats.flaggedReviews[0]?.count || 0,
    };
  } catch (error) {
    logger.error("Service Error: getReviewStats", error);

    throw error;
  }
};

export const getAllReviews = async (query: any) => {
  try {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter: any = {};

    if (query.companyType) {
      filter.companyType = query.companyType;
    }

    if (query.rating) {
      filter.rating = Number(query.rating);
    }

    if (query.isFlagged !== undefined) {
      filter.isFlagged = query.isFlagged === "true";
    }

    if (query.hasReply === "true") {
      filter["vendorReply.message"] = {
        $exists: true,
        $ne: "",
      };
    }

    if (query.hasReply === "false") {
      filter.$or = [
        { "vendorReply.message": { $exists: false } },
        { "vendorReply.message": "" },
      ];
    }

    let reviews: any[] = await Review.find(filter)
      .populate("userId", "firstName lastName email avatar")
      .populate("vendorId", "businessName")
      .sort({
        createdAt: -1,
      })
      .lean();

    // Search
    if (query.search?.trim()) {
      const search = query.search.trim().toLowerCase();

      reviews = reviews.filter((review: any) => {
        const companyName = review.companyName?.toLowerCase() || "";

        const vendorName = review.vendorId?.businessName?.toLowerCase() || "";

        const userName = `${review.userId?.firstName || ""} ${
          review.userId?.lastName || ""
        }`.toLowerCase();

        return (
          companyName.includes(search) ||
          vendorName.includes(search) ||
          userName.includes(search)
        );
      });
    }

    const total = reviews.length;

    const paginatedReviews = reviews.slice(skip, skip + limit);

    return {
      reviews: paginatedReviews.map((review: any) => ({
        reviewId: review._id,

        userName: `${review.userId?.firstName || ""} ${
          review.userId?.lastName || ""
        }`.trim(),

        companyName: review.companyName,

        companyType: review.companyType,

        vendorName: review.vendorId?.businessName || "",

        rating: review.rating,

        comment:
          review.comment?.length > 80
            ? `${review.comment.substring(0, 80)}...`
            : review.comment,

        hasReply: Boolean(review.vendorReply?.message),

        isFlagged: review.isFlagged,

        createdAt: review.createdAt,
      })),

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    logger.error("Service Error: getAllReviews", error);

    throw error;
  }
};

export const getReviewDetail = async (reviewId: any) => {
  try {
    const review: any = await Review.findById(reviewId)
      .populate("userId", "firstName lastName email phoneNumber avatar")
      .populate("vendorId", "businessName businessEmail businessPhone")
      .lean();

    if (!review) {
      throw new Error("Review not found");
    }

    return {
      reviewId: review._id,

      rating: review.rating,

      comment: review.comment,

      createdAt: review.createdAt,

      user: {
        id: review.userId?._id,

        firstName: review.userId?.firstName,

        lastName: review.userId?.lastName,

        email: review.userId?.email,

        phoneNumber: review.userId?.phoneNumber,

        avatar: review.userId?.avatar,
      },

      company: {
        id: review.companyId,

        name: review.companyName,

        type: review.companyType,
      },

      vendor: {
        id: review.vendorId?._id,

        businessName: review.vendorId?.businessName,

        businessEmail: review.vendorId?.businessEmail,

        businessPhone: review.vendorId?.businessPhone,
      },

      vendorReply: {
        message: review.vendorReply?.message || "",

        repliedAt: review.vendorReply?.repliedAt || null,
      },

      moderation: {
        isFlagged: review.isFlagged,

        flagReason: review.flagReason || "",
      },
    };
  } catch (error) {
    logger.error("Service Error: getReviewDetail", error);

    throw error;
  }
};

export const flagReview = async (reviewId: any, body: any) => {
  try {
    const { isFlagged, flagReason } = body;

    if (typeof isFlagged !== "boolean") {
      throw new Error("isFlagged must be true or false");
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    review.isFlagged = isFlagged;

    if (isFlagged) {
      if (!flagReason?.trim()) {
        throw new Error("Flag reason is required");
      }

      review.flagReason = flagReason.trim();
    } else {
      review.flagReason = "";
    }

    await review.save();

    return {
      message: isFlagged
        ? "Review flagged successfully"
        : "Review unflagged successfully",

      review,
    };
  } catch (error) {
    logger.error("Service Error: flagReview", error);

    throw error;
  }
};

export const deleteReview = async (reviewId: any) => {
  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    const companyType = review.companyType;
    const companyId = review.companyId;

    await review.deleteOne();

    await updateCompanyRating(companyType, companyId);

    return {
      message: "Review deleted successfully",
    };
  } catch (error) {
    logger.error("Service Error: deleteReview", error);

    throw error;
  }
};

export class ReviewService {
  getReviewStats = getReviewStats;
  getAllReviews = getAllReviews;
  getReviewDetail = getReviewDetail;
  flagReview = flagReview;
  deleteReview = deleteReview;
}

export const reviewService = new ReviewService();

const review_service = {
  getReviewStats,
  getAllReviews,
  getReviewDetail,
  flagReview,
  deleteReview,
};

export default review_service;
