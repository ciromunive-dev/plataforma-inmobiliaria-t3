import { test, expect } from "@playwright/test";

const timestamp = Date.now();
const testEmail = `e2e_prop_${timestamp}@test.com`;
const otherEmail = `e2e_other_${timestamp}@test.com`;
const testPassword = "test123456";

async function login(page: import("@playwright/test").Page, email: string) {
  await page.goto("/auth/login");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña").fill(testPassword);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL("/", { timeout: 10000 });
}

async function register(page: import("@playwright/test").Page, email: string, name: string) {
  await page.goto("/auth/register");
  await page.getByLabel("Nombre completo").fill(name);
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña", { exact: true }).fill(testPassword);
  await page.getByLabel("Confirmar contraseña").fill(testPassword);
  await page.getByRole("button", { name: "Crear cuenta" }).click();
  await page.waitForURL("/", { timeout: 10000 });
}

test.describe("Propiedades", () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await register(page, testEmail, "Usuario Propiedades");
    await page.close();

    const page2 = await browser.newPage();
    await register(page2, otherEmail, "Otro Usuario");
    await page2.close();
  });

  test("crear una propiedad", async ({ page }) => {
    await login(page, testEmail);
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

  test("editar propiedad propia y verificar que se actualizó", async ({ page }) => {
    await login(page, testEmail);
    await page.goto("/");

    await page.getByText("Casa E2E de prueba").first().click();
    await expect(page).toHaveURL(/\/properties\/\d+/, { timeout: 10000 });

    await page.getByRole("button", { name: "Editar" }).click();
    await page.getByLabel("Título").fill("Casa E2E actualizada");
    await page.getByRole("button", { name: "Guardar cambios" }).click();

    await expect(page.getByText("Casa E2E actualizada")).toBeVisible({ timeout: 10000 });
  });

  test("eliminar propiedad y verificar que desaparece del listado", async ({ page }) => {
    await login(page, testEmail);
    await page.goto("/properties/new");

    await page.getByLabel("Título").fill("Propiedad a eliminar");
    await page.getByLabel("Descripción").fill("Esta propiedad será eliminada");
    await page.getByLabel("Precio").fill("50000");
    await page.getByLabel("Dormitorios").fill("1");
    await page.getByLabel("Baños").fill("1");
    await page.getByLabel("Área").fill("50");
    await page.getByRole("button", { name: "Publicar propiedad" }).click();
    await expect(page).toHaveURL(/\/properties\/\d+/, { timeout: 10000 });

    await page.getByRole("button", { name: "Eliminar" }).click();
    await page.getByRole("button", { name: "Sí, eliminar" }).click();

    await expect(page).toHaveURL("/", { timeout: 10000 });
    await expect(page.getByText("Propiedad a eliminar")).not.toBeVisible({ timeout: 5000 });
  });

  test("filtros de búsqueda funcionan", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder("Buscar propiedades...").fill("Casa E2E");
    await expect(page.getByText("Casa E2E actualizada").first()).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: /Filtros/ }).click();
    await page.getByLabel("Dormitorios mínimos").selectOption("3");
    await expect(page.getByText("Casa E2E actualizada").first()).toBeVisible({ timeout: 5000 });

    await page.getByLabel("Precio mínimo (S/)").fill("200000");
    await expect(page.getByText("Casa E2E actualizada").first()).not.toBeVisible({ timeout: 5000 });
  });

  test("usuario no ve botones de editar/eliminar en propiedades ajenas", async ({ page }) => {
    await login(page, otherEmail);
    await page.goto("/");

    await page.getByText("Casa E2E actualizada").first().click();
    await expect(page).toHaveURL(/\/properties\/\d+/, { timeout: 10000 });

    await expect(page.getByRole("button", { name: "Editar" })).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Eliminar" })).not.toBeVisible();
  });
});
