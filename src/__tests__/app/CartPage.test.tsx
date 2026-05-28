import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CartPage from "@/app/cart/page";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("Cart Page", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as unknown as ReturnType<typeof useRouter>);
  });

  it("should render EmptyCart when cart is empty", () => {
    useCartStore.setState({ items: [] });
    render(<CartPage />);
    expect(
      screen.getByText("Parece que não há nada por aqui :(")
    ).toBeInTheDocument();
  });

  it("should render cart items and total price when cart is not empty", () => {
    const mockItem = {
      movie: { id: 1, title: "Movie 1", price: 10, image: "image1.png" },
      quantity: 2,
    };
    useCartStore.setState({ items: [mockItem] });

    render(<CartPage />);
    expect(screen.getByText("Movie 1")).toBeInTheDocument();
    expect(screen.getAllByText("R$ 20,00")).toHaveLength(2);
  });

  it("should finish order and redirect to success page", () => {
    const mockItem = {
      movie: { id: 1, title: "Movie 1", price: 10, image: "image1.png" },
      quantity: 2,
    };
    useCartStore.setState({ items: [mockItem] });

    render(<CartPage />);

    const finishButton = screen.getByText("Finalizar Pedido");
    fireEvent.click(finishButton);

    expect(useCartStore.getState().items).toHaveLength(0);
    expect(mockPush).toHaveBeenCalledWith("/success");
  });
});
