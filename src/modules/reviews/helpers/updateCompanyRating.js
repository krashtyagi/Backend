const Review = require("../review.model");

const Hotel = require("../../hotels/hotel.model");

const Adventure = require("../../adventure/category/adventure.model");
const BikeCompany = require("../../bike/company/bike.model");
const CabCompany = require("../../cab/company/cab.model");
const TourCompany = require("../../tour/company/tour.model");

exports.updateCompanyRating = async (companyType, companyId) => {
  try {
    const stats = await Review.aggregate([
      {
        $match: {
          companyType,
          companyId,
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
