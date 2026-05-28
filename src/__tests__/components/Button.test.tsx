import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "@/components/Button";

describe("Button", () => {
  it("should render children text", () => {
    render(<Button>Adicionar</Button>);
    expect(
      screen.getByRole("button", { name: "Adicionar" })
    ).toBeInTheDocument();
  });

  it("should call onClick handler when clicked", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Clique aqui</Button>);
    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should apply primary variant styles by default", () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-primary");
  });

  it("should apply success variant styles", () => {
    render(<Button variant="success">Success</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-success");
  });

  it("should apply full width when fullWidth is true", () => {
    render(<Button fullWidth>Full</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("w-full");
  });

  it("should not apply full width by default", () => {
    render(<Button>Normal</Button>);
    const button = screen.getByRole("button");
    expect(button.className).not.toContain("w-full");
  });

  it("should pass additional className", () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("custom-class");
  });

  it("should pass native button attributes", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
