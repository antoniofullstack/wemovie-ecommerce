import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMovies } from "@/hooks/useMovies";
import * as api from "@/services/api";

const mockMovies = [
  { id: 1, title: "Viúva Negra", price: 29.99, image: "https://example.com/viuva-negra.png" },
  { id: 2, title: "Shang-Chi", price: 29.99, image: "https://example.com/shang-chi.png" },
];

vi.mock("@/services/api");

describe("useMovies", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should start with loading state", () => {
    vi.mocked(api.getMovies).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useMovies());

    expect(result.current.loading).toBe(true);
    expect(result.current.movies).toEqual([]);
    expect(result.current.error).toBe(false);
  });

  it("should load movies successfully", async () => {
    vi.mocked(api.getMovies).mockResolvedValue(mockMovies);

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.error).toBe(false);
  });

  it("should set error state when fetch fails", async () => {
    vi.mocked(api.getMovies).mockRejectedValue(new Error("API Error"));

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(true);
    expect(result.current.movies).toEqual([]);
  });

  it("should provide a refetch function", async () => {
    vi.mocked(api.getMovies).mockResolvedValue(mockMovies);

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe("function");
  });

  it("should refetch movies when refetch is called", async () => {
    vi.mocked(api.getMovies).mockResolvedValue(mockMovies);

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const updatedMovies = [...mockMovies, { id: 3, title: "Eternos", price: 39.99, image: "https://example.com/eternos.png" }];
    vi.mocked(api.getMovies).mockResolvedValue(updatedMovies);

    result.current.refetch();

    await waitFor(() => {
      expect(result.current.movies).toEqual(updatedMovies);
    });
  });

  it("should keep the latest refetch result when requests resolve out of order", async () => {
    let resolveFirst: (value: typeof mockMovies) => void;
    let resolveSecond: (value: typeof mockMovies) => void;

    const firstRequest = new Promise<typeof mockMovies>((resolve) => {
      resolveFirst = resolve;
    });

    const secondRequest = new Promise<typeof mockMovies>((resolve) => {
      resolveSecond = resolve;
    });

    vi.mocked(api.getMovies)
      .mockReturnValueOnce(firstRequest)
      .mockReturnValueOnce(secondRequest);

    const { result } = renderHook(() => useMovies());

    const latestMovies = [{ id: 10, title: "Batman", price: 19.99, image: "https://example.com/batman.png" }];
    result.current.refetch();

    resolveSecond!(latestMovies);

    await waitFor(() => {
      expect(result.current.movies).toEqual(latestMovies);
      expect(result.current.loading).toBe(false);
    });

    resolveFirst!(mockMovies);

    await waitFor(() => {
      expect(result.current.movies).toEqual(latestMovies);
      expect(result.current.loading).toBe(false);
    });
  });

});
