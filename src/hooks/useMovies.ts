"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Movie } from "@/types/movie";
import { getMovies } from "@/services/api";

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const requestIdRef = useRef(0);

  const fetchMovies = useCallback(() => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(false);

    getMovies()
      .then((data) => {
        if (requestId === requestIdRef.current) {
          setMovies(data);
        }
      })
      .catch(() => {
        if (requestId === requestIdRef.current) {
          setError(true);
        }
      })
      .finally(() => {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return { movies, loading, error, refetch: fetchMovies };
}
