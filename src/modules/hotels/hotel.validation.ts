import { z } from "zod";

export const hotelValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long"),

    description: z
      .string()
      .min(20, "Description should be at least 20 characters"),

    address: z.string().min(1, "Address is required"),

    city: z.string().min(1, "City is required"),

    location: z.object({
      coordinates: z
        .array(z.number())
        .length(2, "Coordinates must contain Longitude and Latitude"),
    }),

    images: z.array(z.string()).min(1, "At least one image URL is required"),

    amenities: z.array(z.string()).optional(),

    distanceFromCenter: z.number().optional(),
  }),
});

export type HotelValidationInput = z.infer<typeof hotelValidationSchema>;
