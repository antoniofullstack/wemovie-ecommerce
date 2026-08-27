import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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
  // RootLayout returns a full <html>/<body> document, which React cannot nest
  // inside the default RTL <div> container. That triggers a benign
  // validateDOMNesting warning that is irrelevant to this test, so we filter it.
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    const originalError = console.error;
    consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation((...args) => {
        const message = String(args[0] ?? "");
        if (message.includes("cannot be a child of")) return;
        originalError(...args);
      });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

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
