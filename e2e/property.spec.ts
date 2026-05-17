import { test, expect } from "@playwright/test";

const timestamp = Date.now();
const testEmail = `e2e_prop_${timestamp}@test.com`;
const testPassword = "test123456";

test.describe("Propiedades", () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/auth/register");
    await page.getByLabel("Nombre completo").fill("Usuario Propiedades");
    await page.getByLabel("Correo electrónico").fill(testEmail);
    await page.getByLabel("Contraseña", { exact: true }).fill(testPassword);
    await page.getByLabel("Confirmar contraseña").fill(testPassword);
    await page.getByRole("button", { name: "Crear cuenta" }).click();
    await page.waitForURL("/", { timeout: 10000 });
    await page.close();
  });

  test("crear una propiedad", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByLabel("Correo electrónico").fill(testEmail);
    await page.getByLabel("Contraseña").fill(testPassword);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL("/", { timeout: 10000 });

    await page.goto("/properties/new");

    await page.getByLabel("Título").fill("Casa E2E de prueba");
    await page.getByLabel("Descripción").fill("Descripción de prueba para test E2E");
    await page.getByLabel("Precio").fill("150000");
    await page.getByLabel("Dormitorios").fill("3");
    await page.getByLabel("Baños").fill("2");
    await page.getByLabel("Área").fill("120");

    await page.getByRole("button", { name: "Publicar propiedad" }).click();

    await expect(page).toHaveURL(/\/properties\/\d+/, { timeout: 10000 });
    await expect(page.getByText("Casa E2E de prueba")).toBeVisible();
  });

  test("la propiedad aparece en el listado", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Casa E2E de prueba").first()).toBeVisible({ timeout: 10000 });
  });
});
