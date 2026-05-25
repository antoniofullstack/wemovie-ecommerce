import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmptyCart from "@/components/EmptyCart";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("EmptyCart", () => {
  it("should render empty cart message", () => {
    render(<EmptyCart />);
    expect(screen.getByText("Parece que não há nada por aqui :(")).toBeInTheDocument();
  });

  it("should render empty cart illustration", () => {
    render(<EmptyCart />);
    expect(screen.getByAltText("Carrinho vazio")).toBeInTheDocument();
  });

  it("should render reload button", () => {
    render(<EmptyCart />);
    expect(screen.getByRole("button", { name: "Recarregar página" })).toBeInTheDocument();
  });

  it("should navigate to home when reload button is clicked", async () => {
    const user = userEvent.setup();
    render(<EmptyCart />);

    await user.click(screen.getByRole("button", { name: "Recarregar página" }));

    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
