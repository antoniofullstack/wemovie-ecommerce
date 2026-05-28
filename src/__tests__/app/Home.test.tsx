import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { useMovies } from "@/hooks/useMovies";

vi.mock("@/hooks/useMovies");

describe("Home Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading spinner when loading", () => {
    vi.mocked(useMovies).mockReturnValue({
      movies: [],
      loading: true,
      error: false,
      refetch: vi.fn(),
    });

    render(<Home />);
    expect(screen.getByAltText("Carregando...")).toBeInTheDocument();
  });

  it("should render error message and retry button when error occurs", () => {
    const refetch = vi.fn();
    vi.mocked(useMovies).mockReturnValue({
      movies: [],
      loading: false,
      error: true,
      refetch,
    });

    render(<Home />);
    expect(
      screen.getByText("Ocorreu um erro ao carregar os filmes.")
    ).toBeInTheDocument();
    
    const retryButton = screen.getByText("Tentar novamente");
    retryButton.click();
    expect(refetch).toHaveBeenCalled();
  });

  it("should render movies list when loaded successfully", () => {
    const mockMovies = [
      {
        id: 1,
        title: "Movie 1",
        price: 10,
        image: "image1.png",
      },
    ];
    vi.mocked(useMovies).mockReturnValue({
      movies: mockMovies,
      loading: false,
      error: false,
      refetch: vi.fn(),
    });

    render(<Home />);
    expect(screen.getByText("Movie 1")).toBeInTheDocument();
  });
});
