import { hotelRouter } from "./hotel.rpc";
import { tourRouter } from "./tour.rpc";
import type { RouterClient } from "@orpc/server";

export const appRouter = {
  hotel: hotelRouter,
  tour: tourRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
