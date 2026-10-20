import mongoose from "mongoose";
import Review from "../review.model.js";
import Hotel from "../../hotels/hotel.model.js";
import Adventure from "../../adventure/category/adventure.model.js";
import BikeCompany from "../../bike/company/bike.model.js";
import CabCompany from "../../cab/company/cab.model.js";
import TourCompany from "../../tour/company/tour.model.js";

export const updateCompanyRating = async (companyType: string, companyId: any) => {
  try {
    const companyObjectId = mongoose.Types.ObjectId.isValid(companyId)
      ? new mongoose.Types.ObjectId(companyId)
      : companyId;

    const stats = await Review.aggregate([
      {
        $match: {
          companyType,
          $or: [
            { companyId: companyObjectId },
            { companyId: String(companyId) },
          ],
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
    ]);

    const averageRating = stats[0]?.averageRating || 0;

    const totalReviews = stats[0]?.totalReviews || 0;

    switch (companyType) {
      case "hotel":
        await Hotel.findByIdAndUpdate(companyId, {
          rating: Number(averageRating.toFixed(1)),

          numReviews: totalReviews,
        });
        break;

      case "adventure":
        await Adventure.findByIdAndUpdate(companyId, {
          rating: {
            average: Number(averageRating.toFixed(1)),

            count: totalReviews,
          },
        });
        break;

      case "bike":
        await BikeCompany.findByIdAndUpdate(companyId, {
          rating: {
            average: Number(averageRating.toFixed(1)),

            count: totalReviews,
          },
        });
        break;

      case "cab":
        await CabCompany.findByIdAndUpdate(companyId, {
          rating: {
            average: Number(averageRating.toFixed(1)),

            count: totalReviews,
          },
        });
        break;

      case "tour":
        await TourCompany.findByIdAndUpdate(companyId, {
          rating: {
            average: Number(averageRating.toFixed(1)),

            count: totalReviews,
          },
        });
        break;

      default:
        throw new Error("Invalid company type");
    }
  } catch (error) {
    throw error;
  }
};
