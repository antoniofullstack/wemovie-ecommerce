import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import MovieList from "@/components/MovieList";
import { getMovies } from "@/services/api";
import { moviesQueryKey } from "@/hooks/useMovies";

// Revalidate the movie catalog periodically (ISR).
export const revalidate = 60;

export default async function Home() {
  const queryClient = new QueryClient();

  // Prefetch on the server and hand the cache to the client. prefetchQuery
  // never throws, so an API failure simply leaves the client to refetch/retry.
  await queryClient.prefetchQuery({
    queryKey: moviesQueryKey,
    queryFn: getMovies,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MovieList />
    </HydrationBoundary>
  );
}
