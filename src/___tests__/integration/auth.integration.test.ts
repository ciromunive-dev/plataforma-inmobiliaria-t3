import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { authRouter } from "~/server/api/routers/auth";
import { testDb, cleanDb } from "./helpers/test-db";

const caller = authRouter.createCaller({ db: testDb, session: null });

describe("auth router", () => {
  beforeEach(async () => {
    await cleanDb();
  });

  afterAll(async () => {
    await testDb.$disconnect();
  });

  it("registra un usuario nuevo", async () => {
    const result = await caller.register({
      name: "Test User",
      email: "test@test.com",
      password: "123456",
    });

    expect(result.success).toBe(true);

    const user = await testDb.user.findUnique({ where: { email: "test@test.com" } });
    expect(user).not.toBeNull();
    expect(user?.name).toBe("Test User");
    expect(user?.password).not.toBe("123456"); // debe estar hasheado
  });

  it("falla si el email ya existe", async () => {
    await caller.register({ email: "dup@test.com", password: "123456" });

    await expect(
      caller.register({ email: "dup@test.com", password: "654321" })
    ).rejects.toThrow("El email ya está registrado");
  });
});
