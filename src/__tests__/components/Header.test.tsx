import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "@/components/Header";
import { useCartStore } from "@/store/useCartStore";

vi.mock("@/store/useCartStore", async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual: any = await vi.importActual("@/store/useCartStore");
  return {
    ...actual,
    useHydratedCartValue: (selector: (state: unknown) => unknown) => selector(actual.useCartStore.getState()),
  };
});

describe("Header", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("should render the brand name WeMovies", () => {
    render(<Header />);
    expect(screen.getByText("WeMovies")).toBeInTheDocument();
  });

  it("should have a link to the home page", () => {
    render(<Header />);
    const homeLink = screen.getByText("WeMovies");
    expect(homeLink.closest("a")).toHaveAttribute("href", "/");
  });

  it("should have a link to the cart page", () => {
    render(<Header />);
    const cartLink = screen.getByText(/itens|item/i).closest("a");
    expect(cartLink).toHaveAttribute("href", "/cart");
  });

  it("should show 0 itens when cart is empty", () => {
    render(<Header />);
    expect(screen.getByText("0 itens")).toBeInTheDocument();
  });

  it("should show correct item count singular", () => {
    useCartStore.setState({
      items: [
        {
          movie: { id: 1, title: "Test", price: 10, image: "test.png" },
          quantity: 1,
        },
      ],
    });

    render(<Header />);
    expect(screen.getByText("1 item")).toBeInTheDocument();
  });

  it("should show correct total item count with multiple items", () => {
    useCartStore.setState({
      items: [
        {
          movie: { id: 1, title: "Movie 1", price: 10, image: "test1.png" },
          quantity: 2,
        },
        {
          movie: { id: 2, title: "Movie 2", price: 20, image: "test2.png" },
          quantity: 3,
        },
      ],
    });

    render(<Header />);
    expect(screen.getByText("5 itens")).toBeInTheDocument();
  });

  it("should render cart icon", () => {
    render(<Header />);
    expect(screen.getByAltText("Carrinho")).toBeInTheDocument();
  });
});
