import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SuccessPage from "@/app/success/page";

describe("Success Page", () => {
  it("should render success message", () => {
    render(<SuccessPage />);
    expect(screen.getByText("Compra realizada com sucesso!")).toBeInTheDocument();
  });

  it("should render success image", () => {
    render(<SuccessPage />);
    expect(screen.getByAltText("Compra realizada com sucesso")).toBeInTheDocument();
  });

  it("should render back button with correct link", () => {
    render(<SuccessPage />);
    const link = screen.getByRole("link", { name: /voltar/i });
    expect(link).toHaveAttribute("href", "/");
  });
});
