"use client";

import { useQuery } from "@tanstack/react-query";
import { getMovies } from "@/services/api";

export const moviesQueryKey = ["movies"] as const;

export function useMovies() {
  const query = useQuery({
    queryKey: moviesQueryKey,
    queryFn: getMovies,
  });

  return {
    movies: query.data ?? [],
    loading: query.isLoading,
    error: query.isError,
    refetch: query.refetch,
  };
}
