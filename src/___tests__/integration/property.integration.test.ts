import { describe, it, expect, beforeEach } from "vitest";
import { propertyRouter } from "~/server/api/routers/property";
import { testDb, cleanDb } from "./helpers/test-db";

const propertyData = {
  title: "Casa de prueba",
  description: "Descripción de prueba",
  price: 100000,
  bedrooms: 3,
  bathrooms: 2,
  area: 120,
  images: [],
};

async function createTestUser() {
  return testDb.user.create({
    data: { email: "owner@test.com", password: "hashed" },
  });
}

function callerWithSession(userId: number) {
  return propertyRouter.createCaller({
    db: testDb,
    session: { user: { id: String(userId), email: "owner@test.com" }, expires: "" },
  });
}

const publicCaller = propertyRouter.createCaller({ db: testDb, session: null });

describe("property router", () => {
  beforeEach(async () => {
    await cleanDb();
  });


  it("crea una propiedad con sesión", async () => {
    const user = await createTestUser();
    const property = await testDb.property.create({ data: { ...propertyData, userId: user.id } });

    expect(property.title).toBe("Casa de prueba");
    expect(property.userId).toBe(user.id);
  });

  it("falla al crear sin sesión", async () => {
    await expect(publicCaller.create(propertyData)).rejects.toThrow();
  });

  it("obtiene todas las propiedades", async () => {
    const user = await createTestUser();
    await testDb.property.create({ data: { ...propertyData, userId: user.id } });

    const result = await publicCaller.getAll({ page: 1 });

    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it("no permite editar propiedad ajena", async () => {
    const owner = await createTestUser();
    const other = await testDb.user.create({
      data: { email: "other@test.com", password: "hashed" },
    });

    const property = await testDb.property.create({
      data: { ...propertyData, userId: owner.id },
    });

    await expect(
      callerWithSession(other.id).update({ id: property.id, ...propertyData, title: "Hack" })
    ).rejects.toThrow("No tienes permiso");
  });

  it("no permite eliminar propiedad ajena", async () => {
    const owner = await createTestUser();
    const other = await testDb.user.create({
      data: { email: "other2@test.com", password: "hashed" },
    });

    const property = await callerWithSession(owner.id).create(propertyData);

    await expect(
      callerWithSession(other.id).delete({ id: property.id })
    ).rejects.toThrow("No tienes permiso");
  });

  it("getAll con paginación devuelve 9 en página 1 y 1 en página 2", async () => {
    const user = await createTestUser();
    for (let i = 0; i < 10; i++) {
      await testDb.property.create({
        data: { ...propertyData, title: `Propiedad ${i + 1}`, userId: user.id },
      });
    }

    const page1 = await publicCaller.getAll({ page: 1 });
    const page2 = await publicCaller.getAll({ page: 2 });

    expect(page1.items).toHaveLength(9);
    expect(page1.total).toBe(10);
    expect(page1.pageCount).toBe(2);
    expect(page2.items).toHaveLength(1);
  });

  it("getById devuelve la propiedad correcta", async () => {
    const user = await createTestUser();
    const created = await testDb.property.create({
      data: { ...propertyData, userId: user.id },
    });

    const result = await publicCaller.getById({ id: created.id });

    expect(result).not.toBeNull();
    expect(result!.id).toBe(created.id);
    expect(result!.title).toBe(propertyData.title);
  });

  it("el owner puede actualizar su propiedad", async () => {
    const owner = await createTestUser();
    const property = await callerWithSession(owner.id).create(propertyData);

    const updated = await callerWithSession(owner.id).update({
      id: property.id,
      ...propertyData,
      title: "Título actualizado",
      price: 200000,
    });

    expect(updated.title).toBe("Título actualizado");
    expect(updated.price).toBe(200000);
  });

  it("el owner puede eliminar su propiedad", async () => {
    const owner = await createTestUser();
    const property = await callerWithSession(owner.id).create(propertyData);

    await callerWithSession(owner.id).delete({ id: property.id });

    const deleted = await testDb.property.findUnique({ where: { id: property.id } });
    expect(deleted).toBeNull();
  });
});
