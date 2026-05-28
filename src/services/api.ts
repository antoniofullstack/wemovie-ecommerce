import { Movie } from "@/types/movie";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://wemovies-seven.vercel.app/api/movies";

function isMovie(value: unknown): value is Movie {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const movie = value as Record<string, unknown>;
  return (
    typeof movie.id === "number" &&
    typeof movie.title === "string" &&
    typeof movie.price === "number" &&
    typeof movie.image === "string"
  );
}

export async function getMovies(): Promise<Movie[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Falha ao buscar filmes");
  }

  const data: unknown = await response.json();
  const products = (data as { products?: unknown })?.products;

  if (!Array.isArray(products) || !products.every(isMovie)) {
    throw new Error("Resposta da API em formato inesperado");
  }

  return products;
}
