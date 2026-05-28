import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";

// Mock next/font/google
vi.mock("next/font/google", () => ({
  Open_Sans: () => ({
    variable: "--font-open-sans",
  }),
}));

// Mock Header component to avoid complex store interactions in layout test
vi.mock("@/components/Header", () => ({
  default: () => <header data-testid="mock-header">Header</header>,
}));

describe("RootLayout", () => {
  it("should render header and children", () => {
    render(
      <RootLayout>
        <div data-testid="child-content">Child Content</div>
      </RootLayout>
    );

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });
});
