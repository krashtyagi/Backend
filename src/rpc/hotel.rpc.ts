import { os } from "@orpc/server";
import { z } from "zod";
import {
  getHomeHotels,
  getAllHotels,
  getHotelDetails,
  getHotelAvailability,
  findNearbyHotels,
  getSuggestions,
  searchHotels,
  getRankedHotels,
} from "../modules/hotels/hotel.service";

export const hotelRouter = {
  // GET /hotels/home
  getNewHotels: os.handler(async () => {
    const hotels = await getHomeHotels();
    return {
      success: true as const,
      count: hotels.length,
      data: hotels,
    };
  }),

  // GET /hotels (with filters)
  getAll: os
    .input(
      z.object({
        city: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        minRating: z.number().optional(),
        amenities: z.array(z.string()).optional(),
        maxSize: z.number().optional(),
        adults: z.number().optional(),
        children: z.number().optional(),
        beds: z.number().optional(),
        bathrooms: z.number().optional(),
        checkIn: z.string().optional(),
        checkOut: z.string().optional(),
        typeOfPlace: z.array(z.string()).optional(),
        page: z.number().optional().default(1),
        limit: z.number().optional().default(9),
      }),
    )
    .handler(async ({ input }) => {
      const { hotels, total } = await getAllHotels(input);
      return {
        success: true as const,
        count: hotels.length,
        total,
        data: hotels,
      };
    }),

  // GET /hotels/:id
  getDetails: os
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      const hotel = await getHotelDetails(input.id);
      return {
        success: true as const,
        data: hotel,
      };
    }),

  // GET /hotels/:id/availability
  getAvailability: os
    .input(
      z.object({
        hotelId: z.string(),
        checkIn: z.string(),
        checkOut: z.string(),
        adults: z.number().optional(),
        children: z.number().optional(),
      }),
    )
    .handler(async ({ input }) => {
      const data = await getHotelAvailability(
        input.hotelId,
        input.checkIn,
        input.checkOut,
        input.adults,
        input.children,
      );
      return {
        success: true as const,
        data,
      };
    }),

  // GET /hotels/nearby
  getNearby: os
    .input(
      z.object({
        lng: z.number(),
        lat: z.number(),
        distance: z.number().optional().default(5000),
      }),
    )
    .handler(async ({ input }) => {
      const hotels = await findNearbyHotels(input.lng, input.lat, input.distance);
      return {
        success: true as const,
        count: hotels.length,
        data: hotels,
      };
    }),

  // GET /hotels/suggestions
  getSuggestions: os
    .input(z.object({ q: z.string() }))
    .handler(async ({ input }) => {
      const suggestions = await getSuggestions(input.q);
      return {
        success: true as const,
        data: suggestions,
      };
    }),

  // GET /hotels/search
  search: os
    .input(
      z.object({
        destination: z.string(),
        checkIn: z.string().optional(),
        checkOut: z.string().optional(),
        adults: z.number().optional().default(1),
        children: z.number().optional().default(0),
        page: z.number().optional().default(1),
        limit: z.number().optional().default(10),
      }),
    )
    .handler(async ({ input }) => {
      const hotels = await searchHotels(input);
      return {
        success: true as const,
        data: hotels,
      };
    }),

  // GET /hotels/ranked
  getRanked: os
    .input(
      z.object({
        rank: z.string(),
        page: z.number().optional().default(1),
        limit: z.number().optional().default(10),
      }),
    )
    .handler(async ({ input }) => {
      const result = await getRankedHotels(input.rank, input.page, input.limit);
      return {
        success: true as const,
        ...result,
      };
    }),
};
