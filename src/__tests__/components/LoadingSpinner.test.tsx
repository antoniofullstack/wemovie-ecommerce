import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "@/components/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("should render loading image with alt text", () => {
    render(<LoadingSpinner />);
    const img = screen.getByAltText("Carregando...");
    expect(img).toBeInTheDocument();
  });

  it("should have animate-spin class for rotation", () => {
    render(<LoadingSpinner />);
    const img = screen.getByAltText("Carregando...");
    expect(img.className).toContain("animate-spin");
  });
});
