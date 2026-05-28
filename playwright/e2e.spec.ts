import { test, expect } from "@playwright/test";

test.describe("WeMovies E2E Purchase Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the home page before each test
    await page.goto("/");
  });

  test("should complete a full purchase journey successfully", async ({
    page,
  }) => {
    // 1. Verify Home Page loads with movies
    await expect(page.locator("h2").first()).toBeVisible();

    // 2. Add "Viúva Negra" to cart
    const viuvaCard = page.locator('[data-testid^="movie-card-"]', {
      hasText: "Viúva Negra",
    });
    const addButton = viuvaCard.getByTestId("add-to-cart-button");

    await expect(addButton.getByTestId("cart-quantity")).toHaveText("0");
    await addButton.click();

    // Check if button state changed (bg-success and count 1)
    await expect(addButton.getByTestId("cart-quantity")).toHaveText("1");
    await expect(addButton).toHaveClass(/bg-success/);

    // 3. Add "Shang-Chi" to cart
    const shangCard = page.locator('[data-testid^="movie-card-"]', {
      hasText: "Shang-Chi",
    });
    await shangCard.getByTestId("add-to-cart-button").click();

    // 4. Check Header Cart Count
    const headerCart = page.locator('header a[href="/cart"]');
    await expect(headerCart).toContainText("2 itens");

    // 5. Navigate to Cart
    await headerCart.click();
    await expect(page).toHaveURL("/cart");

    // 6. Verify items in Cart
    await expect(page.getByText("Viúva Negra")).toBeVisible();
    await expect(page.getByText("Shang-Chi")).toBeVisible();

    // 7. Increase quantity of Viúva Negra
    const viuvaRow = page.locator('[data-testid^="cart-item-"]', {
      hasText: "Viúva Negra",
    });
    await viuvaRow.getByTestId("increment-quantity").click();

    // Verify quantity updated (should show 2)
    await expect(viuvaRow.getByTestId("item-quantity")).toHaveText("2");

    // 8. Remove Shang-Chi from cart
    const shangRow = page.locator('[data-testid^="cart-item-"]', {
      hasText: "Shang-Chi",
    });
    await shangRow.getByTestId("remove-item-desktop").click();

    await expect(page.getByText("Shang-Chi")).not.toBeVisible();

    // 9. Verify Total (Viúva Negra is 29.99 * 2 = 59.98)
    await expect(
      page.getByText("Total").locator("xpath=following-sibling::span")
    ).toContainText("R$ 59,98");

    // 10. Finalize Order
    await page.getByRole("button", { name: /finalizar pedido/i }).click();

    // 11. Success Page
    await expect(page).toHaveURL("/success");
    await expect(page.getByText("Compra realizada com sucesso!")).toBeVisible();

    // 12. Return Home and verify cart is empty
    await page.getByRole("link", { name: /voltar/i }).click();
    await expect(page).toHaveURL("/");
    await expect(page.locator("header")).toContainText("0 itens");
  });

  test("should handle empty cart state and deep linking", async ({ page }) => {
    // 1. Go directly to cart
    await page.goto("/cart");

    // 2. Verify empty cart message
    await expect(
      page.getByText("Parece que não há nada por aqui :(")
    ).toBeVisible();

    // 3. Click back button (Reload page in this app context often points back or reloads)
    const backButton = page
      .getByRole("button", { name: /voltar/i })
      .or(page.getByRole("button", { name: /recarregar página/i }));
    await backButton.click();

    await expect(page).toHaveURL("/");
  });
});
