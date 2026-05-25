import { describe, it, expect } from "vitest";
import { formatCurrency } from "@/utils/formatCurrency";

function normalize(str: string): string {
  return str.replace(/\u00a0/g, " ");
}

describe("formatCurrency", () => {
  it("should format a positive integer as BRL currency", () => {
    expect(normalize(formatCurrency(10))).toBe("R$ 10,00");
  });

  it("should format a decimal value as BRL currency", () => {
    expect(normalize(formatCurrency(29.99))).toBe("R$ 29,99");
  });

  it("should format zero as BRL currency", () => {
    expect(normalize(formatCurrency(0))).toBe("R$ 0,00");
  });

  it("should format large values with thousand separator", () => {
    const result = normalize(formatCurrency(1250.5));
    expect(result).toContain("1.250,50");
  });

  it("should format negative values", () => {
    const result = normalize(formatCurrency(-15));
    expect(result).toContain("15,00");
  });

  it("should return a string", () => {
    expect(typeof formatCurrency(10)).toBe("string");
  });

  it("should contain R$ symbol", () => {
    expect(formatCurrency(10)).toContain("R$");
  });
});
