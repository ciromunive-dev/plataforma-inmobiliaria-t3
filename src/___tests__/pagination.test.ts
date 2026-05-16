import { describe, it, expect } from "vitest";

const PAGE_SIZE = 9;

function getPaginationResult(total: number, page: number) {
  const skip = (page - 1) * PAGE_SIZE;
  const pageCount = Math.ceil(total / PAGE_SIZE);
  return { skip, take: PAGE_SIZE, pageCount, page };
}

describe("lógica de paginación", () => {
  it("página 1 tiene skip 0", () => {
    const result = getPaginationResult(27, 1);
    expect(result.skip).toBe(0);
  });

  it("página 2 tiene skip 9", () => {
    const result = getPaginationResult(27, 2);
    expect(result.skip).toBe(9);
  });

  it("página 3 tiene skip 18", () => {
    const result = getPaginationResult(27, 3);
    expect(result.skip).toBe(18);
  });

  it("take siempre es PAGE_SIZE", () => {
    const result = getPaginationResult(100, 5);
    expect(result.take).toBe(9);
  });

  it("27 items → 3 páginas exactas", () => {
    const result = getPaginationResult(27, 1);
    expect(result.pageCount).toBe(3);
  });

  it("10 items → 2 páginas (redondea hacia arriba)", () => {
    const result = getPaginationResult(10, 1);
    expect(result.pageCount).toBe(2);
  });

  it("0 items → 0 páginas", () => {
    const result = getPaginationResult(0, 1);
    expect(result.pageCount).toBe(0);
  });

  it("9 items exactos → 1 página", () => {
    const result = getPaginationResult(9, 1);
    expect(result.pageCount).toBe(1);
  });

  it("1 item → 1 página", () => {
    const result = getPaginationResult(1, 1);
    expect(result.pageCount).toBe(1);
  });
});
