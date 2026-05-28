import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";
import CartPage from "@/app/cart/page";
import SuccessPage from "@/app/success/page";
import Header from "@/components/Header";
import { useCartStore } from "@/store/useCartStore";
import * as api from "@/services/api";
import { useRouter } from "next/navigation";
import { createQueryWrapper } from "@/__tests__/test-utils";

// Mocking Next.js router
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mocking API
vi.mock("@/services/api");

const mockMovies = [
  {
    id: 1,
    title: "Viúva Negra",
    price: 29.99,
    image: "/images/viuva-negra.png",
  },
  {
    id: 2,
    title: "Shang-Chi",
    price: 30.0,
    image: "/images/shang-chi.png",
  },
];

describe("Integration Flow: Purchase Journey", () => {
  const mockPush = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    useCartStore.setState({ items: [] });
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as unknown as ReturnType<typeof useRouter>);
    vi.mocked(api.getMovies).mockResolvedValue(mockMovies);
  });

  it("should allow a user to add movies to cart and complete the purchase", async () => {
    // 1. Start at Home Page (async Server Component fetches on the server)
    const Wrapper = createQueryWrapper();
    const { rerender } = render(
      <Wrapper>
        <Header />
        {await Home()}
      </Wrapper>
    );

    // Wait for movies to load
    await waitFor(() => {
      expect(screen.getByText("Viúva Negra")).toBeInTheDocument();
    });

    // Check header cart count (0)
    expect(screen.getByText(/0 itens/i)).toBeInTheDocument();

    // 2. Add first movie to cart
    const viuvaCard = screen
      .getByText("Viúva Negra")
      .closest("div")?.parentElement;
    const addViuvaButton = within(viuvaCard!).getByRole("button", {
      name: /adicionar ao carrinho/i,
    });

    await user.click(addViuvaButton);

    // Check button state changed - it shows the quantity (1)
    expect(within(viuvaCard!).getByText("1")).toBeInTheDocument();
    expect(screen.getByText(/1 item/i)).toBeInTheDocument();

    // 3. Add second movie to cart
    const shangCard = screen
      .getByText("Shang-Chi")
      .closest("div")?.parentElement;
    const addShangButton = within(shangCard!).getByRole("button", {
      name: /adicionar ao carrinho/i,
    });

    await user.click(addShangButton);
    expect(screen.getByText(/2 itens/i)).toBeInTheDocument();

    // 4. Navigate to Cart Page
    // We simulate navigation by rendering the CartPage
    rerender(
      <Wrapper>
        <Header />
        <CartPage />
      </Wrapper>
    );

    // Verify items in cart
    expect(screen.getByText("Viúva Negra")).toBeInTheDocument();
    expect(screen.getByText("Shang-Chi")).toBeInTheDocument();

    // Total should be 29.99 + 30.00 = 59.99
    expect(screen.getByText(/R\$ 59,99/)).toBeInTheDocument();

    // 5. Increase quantity of Viúva Negra
    const viuvaRow = screen
      .getByText("Viúva Negra")
      .closest("div")?.parentElement;
    const plusButton = within(viuvaRow!).getByAltText("Aumentar");
    await user.click(plusButton);

    // Check total again: 29.99 * 2 + 30.00 = 89.98
    expect(screen.getByText(/R\$ 89,98/)).toBeInTheDocument();

    // 6. Finish Order
    const finishButton = screen.getByRole("button", {
      name: /finalizar pedido/i,
    });
    await user.click(finishButton);

    // Verify cart is cleared and redirected
    expect(useCartStore.getState().items).toHaveLength(0);
    expect(mockPush).toHaveBeenCalledWith("/success");

    // 7. Success Page
    rerender(
      <Wrapper>
        <Header />
        <SuccessPage />
      </Wrapper>
    );

    expect(
      screen.getByText("Compra realizada com sucesso!")
    ).toBeInTheDocument();
    expect(screen.getByText(/0 itens/i)).toBeInTheDocument();

    const backButton = screen.getByRole("link", { name: /voltar/i });
    expect(backButton).toHaveAttribute("href", "/");
  });
});
