import MovieList from "@/components/MovieList";
import { getMovies } from "@/services/api";
import { Movie } from "@/types/movie";

// Revalidate the movie catalog periodically (ISR).
export const revalidate = 60;

export default async function Home() {
  let initialMovies: Movie[] | undefined;

  try {
    initialMovies = await getMovies();
  } catch {
    // On server fetch failure, let React Query fetch (and retry) on the client.
    initialMovies = undefined;
  }

  return <MovieList initialMovies={initialMovies} />;
}
