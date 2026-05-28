import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import * as api from "@/services/api";

vi.mock("@/services/api");

const mockMovies = [
  { id: 1, title: "Movie 1", price: 10, image: "image1.png" },
  { id: 2, title: "Movie 2", price: 20, image: "image2.png" },
];

describe("Home Page (Server Component)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch movies on the server and render the list", async () => {
    vi.mocked(api.getMovies).mockResolvedValue(mockMovies);

    render(await Home());

    expect(api.getMovies).toHaveBeenCalled();
    expect(screen.getByText("Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Movie 2")).toBeInTheDocument();
  });

  it("should render the error state when the server fetch fails", async () => {
    vi.mocked(api.getMovies).mockRejectedValue(new Error("boom"));

    render(await Home());

    expect(
      screen.getByText("Ocorreu um erro ao carregar os filmes.")
    ).toBeInTheDocument();
    expect(screen.getByText("Tentar novamente")).toBeInTheDocument();
  });
});
