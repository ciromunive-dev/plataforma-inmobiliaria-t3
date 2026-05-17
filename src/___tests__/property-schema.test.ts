import { describe, it, expect } from "vitest";
import { z } from "zod";

const propertyInput = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  bedrooms: z.number().int().positive(),
  bathrooms: z.number().int().positive(),
  area: z.number().positive(),
  images: z.array(z.string().url()).max(6).default([]),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const validProperty = {
  title: "Casa en Miraflores",
  description: "Hermosa casa con jardín",
  price: 450000,
  bedrooms: 3,
  bathrooms: 2,
  area: 150,
  images: [],
};

describe("propertyInput schema", () => {
  it("acepta una propiedad válida", () => {
    const result = propertyInput.safeParse(validProperty);
    expect(result.success).toBe(true);
  });

  it("rechaza título vacío", () => {
    const result = propertyInput.safeParse({ ...validProperty, title: "" });
    expect(result.success).toBe(false);
  });

  it("rechaza descripción vacía", () => {
    const result = propertyInput.safeParse({ ...validProperty, description: "" });
    expect(result.success).toBe(false);
  });

  it("rechaza precio negativo", () => {
    const result = propertyInput.safeParse({ ...validProperty, price: -1000 });
    expect(result.success).toBe(false);
  });

  it("rechaza precio cero", () => {
    const result = propertyInput.safeParse({ ...validProperty, price: 0 });
    expect(result.success).toBe(false);
  });

  it("rechaza dormitorios negativos", () => {
    const result = propertyInput.safeParse({ ...validProperty, bedrooms: -1 });
    expect(result.success).toBe(false);
  });

  it("rechaza dormitorios decimales", () => {
    const result = propertyInput.safeParse({ ...validProperty, bedrooms: 2.5 });
    expect(result.success).toBe(false);
  });

  it("rechaza más de 6 imágenes", () => {
    const images = Array.from({ length: 7 }, (_, i) => `https://example.com/img${i}.jpg`);
    const result = propertyInput.safeParse({ ...validProperty, images });
    expect(result.success).toBe(false);
  });

  it("acepta exactamente 6 imágenes", () => {
    const images = Array.from({ length: 6 }, (_, i) => `https://example.com/img${i}.jpg`);
    const result = propertyInput.safeParse({ ...validProperty, images });
    expect(result.success).toBe(true);
  });

  it("rechaza una URL de imagen inválida", () => {
    const result = propertyInput.safeParse({ ...validProperty, images: ["no-es-una-url"] });
    expect(result.success).toBe(false);
  });

  it("aplica el default de imágenes vacías si se omite el campo", () => {
    const { images: _, ...withoutImages } = validProperty;
    const result = propertyInput.safeParse(withoutImages);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.images).toEqual([]);
  });

  it("acepta propiedad con ubicación completa", () => {
    const result = propertyInput.safeParse({
      ...validProperty,
      address: "Av. Larco 123, Miraflores, Lima",
      latitude: -12.1191,
      longitude: -77.0491,
    });
    expect(result.success).toBe(true);
  });

  it("acepta propiedad sin ubicación (campos opcionales)", () => {
    const result = propertyInput.safeParse(validProperty);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.address).toBeUndefined();
      expect(result.data.latitude).toBeUndefined();
      expect(result.data.longitude).toBeUndefined();
    }
  });

  it("acepta latitud en rango válido de Perú", () => {
    const result = propertyInput.safeParse({
      ...validProperty,
      latitude: -12.0464,
      longitude: -77.0428,
    });
    expect(result.success).toBe(true);
  });
});
