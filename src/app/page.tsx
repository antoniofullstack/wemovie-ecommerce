import MovieList from "@/components/MovieList";
import { getMovies } from "@/services/api";
import { Movie } from "@/types/movie";

// Revalidate the movie catalog periodically (ISR).
export const revalidate = 60;

export default async function Home() {
  let movies: Movie[] = [];
  let hasError = false;

  try {
    movies = await getMovies();
  } catch {
    hasError = true;
  }

  if (hasError) {
    return <MovieList initialError />;
  }

  return <MovieList initialMovies={movies} />;
}
