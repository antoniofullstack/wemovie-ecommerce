import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MovieCard from "@/components/MovieCard";
import { useCartStore } from "@/store/useCartStore";
import { Movie } from "@/types/movie";

const mockMovie: Movie = {
  id: 1,
  title: "Viúva Negra",
  price: 29.99,
  image: "https://example.com/viuva-negra.png",
};

vi.mock("@/store/useCartStore", async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual: any = await vi.importActual("@/store/useCartStore");
  return {
    ...actual,
    useHydratedCartValue: (selector: (state: unknown) => unknown) =>
      selector(actual.useCartStore.getState()),
  };
});

describe("MovieCard", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("should render movie title", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("Viúva Negra")).toBeInTheDocument();
  });

  it("should render movie price formatted as BRL", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("R$ 29,99")).toBeInTheDocument();
  });

  it("should render movie image", () => {
    render(<MovieCard movie={mockMovie} />);
    const img = screen.getByAltText("Viúva Negra");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", mockMovie.image);
  });

  it("should render add to cart button", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("ADICIONAR AO CARRINHO")).toBeInTheDocument();
  });

  it("should show quantity 0 when item is not in cart", () => {
    render(<MovieCard movie={mockMovie} />);
    const quantityElements = screen.getAllByText("0");
    expect(quantityElements.length).toBeGreaterThan(0);
  });

  it("should add item to cart when button is clicked", async () => {
    const user = userEvent.setup();
    render(<MovieCard movie={mockMovie} />);

    await user.click(screen.getByText("ADICIONAR AO CARRINHO"));

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].movie.id).toBe(mockMovie.id);
  });

  it("should show updated quantity after adding item", async () => {
    useCartStore.setState({
      items: [{ movie: mockMovie, quantity: 3 }],
    });

    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
