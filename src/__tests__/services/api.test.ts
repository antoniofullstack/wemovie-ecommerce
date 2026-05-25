import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMovies } from "@/services/api";

const mockMovies = {
  products: [
    { id: 1, title: "Viúva Negra", price: 29.99, image: "https://example.com/viuva-negra.png" },
    { id: 2, title: "Shang-Chi", price: 29.99, image: "https://example.com/shang-chi.png" },
    { id: 3, title: "Eternos", price: 29.99, image: "https://example.com/eternos.png" },
  ],
};

describe("getMovies", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch and return the list of movies", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockMovies),
      })
    );

    const movies = await getMovies();

    expect(fetch).toHaveBeenCalledWith("https://wemovies-seven.vercel.app/api/movies");
    expect(movies).toEqual(mockMovies.products);
    expect(movies).toHaveLength(3);
  });

  it("should throw an error when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })
    );

    await expect(getMovies()).rejects.toThrow("Falha ao buscar filmes");
  });

  it("should throw an error when fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error"))
    );

    await expect(getMovies()).rejects.toThrow("Network error");
  });
});
