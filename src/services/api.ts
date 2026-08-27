import { Movie, moviesResponseSchema } from "@/types/movie";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://wemovies-seven.vercel.app/api/movies";

export async function getMovies(): Promise<Movie[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Falha ao buscar filmes");
  }

  const data: unknown = await response.json();
  const parsed = moviesResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error("Resposta da API em formato inesperado");
  }

  return parsed.data.products;
}
