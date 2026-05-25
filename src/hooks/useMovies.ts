"use client";

import { useCallback, useEffect, useState } from "react";
import { Movie } from "@/types/movie";
import { getMovies } from "@/services/api";

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchMovies = useCallback(() => {
    setLoading(true);
    setError(false);
    getMovies()
      .then(setMovies)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let ignore = false;
    getMovies()
      .then((data) => {
        if (!ignore) setMovies(data);
      })
      .catch(() => {
        if (!ignore) setError(true);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  return { movies, loading, error, refetch: fetchMovies };
}
