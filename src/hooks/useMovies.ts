"use client";

import { useCallback, useEffect, useState } from "react";
import { Movie } from "@/types/movie";
import { getMovies } from "@/services/api";

interface UseMoviesOptions {
  initialMovies?: Movie[];
  initialError?: boolean;
}

export function useMovies({ initialMovies, initialError }: UseMoviesOptions = {}) {
  const hasInitialData = initialMovies !== undefined;

  const [movies, setMovies] = useState<Movie[]>(initialMovies ?? []);
  const [loading, setLoading] = useState(!hasInitialData && !initialError);
  const [error, setError] = useState(initialError ?? false);

  // Performs the request and only mutates state inside async callbacks,
  // so it is safe to call synchronously from an effect.
  const requestMovies = useCallback((guard?: { aborted: boolean }) => {
    getMovies()
      .then((data) => {
        if (!guard?.aborted) {
          setMovies(data);
          setError(false);
        }
      })
      .catch(() => {
        if (!guard?.aborted) setError(true);
      })
      .finally(() => {
        if (!guard?.aborted) setLoading(false);
      });
  }, []);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(false);
    requestMovies();
  }, [requestMovies]);

  useEffect(() => {
    // When the server already provided data, skip the initial client fetch.
    if (hasInitialData || initialError) {
      return;
    }

    const guard = { aborted: false };
    requestMovies(guard);
    return () => {
      guard.aborted = true;
    };
  }, [requestMovies, hasInitialData, initialError]);

  return { movies, loading, error, refetch };
}
