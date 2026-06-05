const { z } = require("zod");

const hotelValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Hotel name is required",
      })
      .min(3, "Name must be at least 3 characters long"),

    description: z
      .string({
        required_error: "Description is required",
      })
      .min(20, "Description should be at least 20 characters"),

    address: z.string({
      required_error: "Address is required",
    }),

    city: z.string({
      required_error: "City is required",
    }),

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

module.exports = {
  hotelValidationSchema,
};
