import { test, expect } from "@playwright/test";

const timestamp = Date.now();
const testEmail = `e2e_${timestamp}@test.com`;
const testPassword = "test123456";
const testName = "Usuario E2E";

test.describe("Autenticación", () => {
  test("registro e inicio de sesión", async ({ page }) => {
    await page.goto("/auth/register");

    await page.getByLabel("Nombre completo").fill(testName);
    await page.getByLabel("Correo electrónico").fill(testEmail);
    await page.getByLabel("Contraseña", { exact: true }).fill(testPassword);
    await page.getByLabel("Confirmar contraseña").fill(testPassword);
    await page.getByRole("button", { name: "Crear cuenta" }).click();

    await expect(page).toHaveURL("/", { timeout: 10000 });
  });

  test("login con credenciales correctas", async ({ page }) => {
    await page.goto("/auth/login");

    await page.getByLabel("Correo electrónico").fill(testEmail);
    await page.getByLabel("Contraseña").fill(testPassword);
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL("/", { timeout: 10000 });
  });

  test("login con credenciales incorrectas muestra error", async ({ page }) => {
    await page.goto("/auth/login");

    await page.getByLabel("Correo electrónico").fill("noexiste@test.com");
    await page.getByLabel("Contraseña").fill("wrongpassword");
    await page.locator('button[type="submit"]').click();

    await expect(page.locator(".bg-red-50")).toContainText("Correo o contraseña incorrectos");
  });
});
