import { z } from "zod";

export const movieSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  image: z.string(),
});

export const moviesResponseSchema = z.object({
  products: z.array(movieSchema),
});

export type Movie = z.infer<typeof movieSchema>;
