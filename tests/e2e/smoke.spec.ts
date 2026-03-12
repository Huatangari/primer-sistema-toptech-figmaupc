import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("login page renders", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Iniciar sesion" })).toBeVisible();
  });

  test("protected route redirects to login when demo bypass is disabled", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
  });
});

