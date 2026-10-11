import { os } from "@orpc/server";
import { z } from "zod";
import {
  getAllTourCompanies,
  getTourCompanyById,
  getTourCompaniesGroupedByCity,
  getRankedTourCompanies,
} from "../modules/tour/company/tour.service";
import {
  getTours,
  getCompanyDetails,
  getTourServiceDetails,
} from "../modules/tour/service/tourService.service";

export const tourRouter = {
  // --- Tour Company routes ---

  // GET /tours/companies
  getCompanies: os
    .input(
      z
        .object({
          city: z.string().optional(),
          page: z.number().optional().default(1),
          limit: z.number().optional().default(10),
        })
        .optional(),
    )
    .handler(async ({ input }) => {
      const result = await getAllTourCompanies(input ?? {});
      return {
        success: true as const,
        count: result.companies.length,
        total: result.total,
        data: result.companies,
        page: result.page,
        limit: result.limit,
      };
    }),

  // GET /tours/companies/:id
  getCompanyById: os
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      const data = await getTourCompanyById(input.id);
      return {
        success: true as const,
        data,
      };
    }),

  // GET /tours/grouped-by-city
  getGroupedByCity: os.handler(async () => {
    const data = await getTourCompaniesGroupedByCity();
    return {
      success: true as const,
      data,
    };
  }),

  // GET /tours/ranked
  getRanked: os
    .input(
      z.object({
        rank: z.string(),
        page: z.number().optional().default(1),
        limit: z.number().optional().default(10),
      }),
    )
    .handler(async ({ input }) => {
      const result = await getRankedTourCompanies(input.rank, input.page, input.limit);
      return {
        success: true as const,
        ...result,
      };
    }),

  // --- Tour Service routes ---

  // GET /tour-services (list tours with filters)
  getTours: os
    .input(
      z
        .object({
          city: z.string().optional(),
          minPrice: z.number().optional(),
          maxPrice: z.number().optional(),
          minRating: z.number().optional(),
          features: z.array(z.string()).optional(),
          amenities: z.array(z.string()).optional(),
          tourType: z.array(z.string()).optional(),
          adults: z.number().optional(),
          children: z.number().optional(),
          checkIn: z.string().optional(),
          checkOut: z.string().optional(),
          page: z.number().optional().default(1),
          limit: z.number().optional().default(9),
        })
        .optional(),
    )
    .handler(async ({ input }) => {
      const data = await getTours(input ?? {});
      return {
        success: true as const,
        data,
      };
    }),

  // GET /tour-services/:id
  getServiceDetails: os
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      const data = await getTourServiceDetails(input.id);
      return {
        success: true as const,
        data,
      };
    }),

  // GET /tour-services/company/:id (company details from tour service side)
  getCompanyDetails: os
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      const data = await getCompanyDetails(input.id);
      return {
        success: true as const,
        data,
      };
    }),
};
