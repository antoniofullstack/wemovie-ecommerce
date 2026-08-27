"use client";

import MovieCard from "@/components/MovieCard";
import ErrorState from "@/components/ErrorState";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useMovies } from "@/hooks/useMovies";

// Number of cards above the fold that should load eagerly to improve LCP.
const EAGER_IMAGE_COUNT = 3;

export default function MovieList() {
  const { movies, loading, error, refetch } = useMovies();

  return (
    <div className="flex flex-1 flex-col pb-10">
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              priority={index < EAGER_IMAGE_COUNT}
            />
          ))}
        </div>
      )}
    </div>
  );
}
