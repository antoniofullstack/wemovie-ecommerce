import { Movie } from "@/types/movie";

const API_URL = "https://wemovies-seven.vercel.app/api/movies";

export async function getMovies(): Promise<Movie[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Falha ao buscar filmes");
  }

  const data = await response.json();
  return data.products as Movie[];
}
