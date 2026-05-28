"use client";

import MovieCard from "@/components/MovieCard";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useMovies } from "@/hooks/useMovies";
import { Movie } from "@/types/movie";

interface MovieListProps {
  initialMovies?: Movie[];
}

export default function MovieList({ initialMovies }: MovieListProps) {
  const { movies, loading, error, refetch } = useMovies({ initialMovies });

  return (
    <div className="flex flex-1 flex-col pb-10">
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <p className="text-sm font-semibold text-white">
            Ocorreu um erro ao carregar os filmes.
          </p>
          <Button onClick={() => refetch()} className="px-6">
            Tentar novamente
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
