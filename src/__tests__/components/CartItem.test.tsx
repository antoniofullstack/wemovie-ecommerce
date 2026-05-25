import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartItem from "@/components/CartItem";
import { useCartStore } from "@/store/useCartStore";
import { CartItem as CartItemType } from "@/types/cart";

const mockCartItem: CartItemType = {
  movie: {
    id: 1,
    title: "Viúva Negra",
    price: 29.99,
    image: "https://example.com/viuva-negra.png",
  },
  quantity: 2,
};

describe("CartItem", () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [mockCartItem],
    });
  });

  it("should render movie title", () => {
    render(<CartItem item={mockCartItem} />);
    expect(screen.getByText("Viúva Negra")).toBeInTheDocument();
  });

  it("should render movie unit price", () => {
    render(<CartItem item={mockCartItem} />);
    expect(screen.getByText("R$ 29,99")).toBeInTheDocument();
  });

  it("should render quantity", () => {
    render(<CartItem item={mockCartItem} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should render subtotal correctly", () => {
    render(<CartItem item={mockCartItem} />);
    expect(screen.getByText("R$ 59,98")).toBeInTheDocument();
  });

  it("should render movie image", () => {
    render(<CartItem item={mockCartItem} />);
    const img = screen.getByAltText("Viúva Negra");
    expect(img).toBeInTheDocument();
  });

  it("should increment quantity when plus button is clicked", async () => {
    const user = userEvent.setup();
    render(<CartItem item={mockCartItem} />);

    await user.click(screen.getByAltText("Aumentar"));

    const { items } = useCartStore.getState();
    expect(items[0].quantity).toBe(3);
  });

  it("should decrement quantity when minus button is clicked", async () => {
    const user = userEvent.setup();
    render(<CartItem item={mockCartItem} />);

    await user.click(screen.getByAltText("Diminuir"));

    const { items } = useCartStore.getState();
    expect(items[0].quantity).toBe(1);
  });

  it("should remove item when trash button is clicked", async () => {
    const user = userEvent.setup();
    render(<CartItem item={mockCartItem} />);

    const removeButtons = screen.getAllByAltText("Remover");
    await user.click(removeButtons[0]);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });
});
