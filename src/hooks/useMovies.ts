"use client";

import { useQuery } from "@tanstack/react-query";
import { Movie } from "@/types/movie";
import { getMovies } from "@/services/api";

export const moviesQueryKey = ["movies"] as const;

interface UseMoviesOptions {
  initialMovies?: Movie[];
}

export function useMovies({ initialMovies }: UseMoviesOptions = {}) {
  const query = useQuery({
    queryKey: moviesQueryKey,
    queryFn: getMovies,
    initialData: initialMovies,
  });

  return {
    movies: query.data ?? [],
    loading: query.isLoading,
    error: query.isError,
    refetch: query.refetch,
  };
}
