import { describe, it, expect } from "vitest";

type FormFields = {
  title: string;
  description: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
};

type FieldErrors = Partial<Record<keyof FormFields, string>>;

function validate(form: FormFields): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.title.trim()) errors.title = "El título es requerido";
  if (!form.description.trim()) errors.description = "La descripción es requerida";
  if (!form.price || Number(form.price) <= 0) errors.price = "Ingresa un precio válido";
  if (!form.bedrooms || Number(form.bedrooms) < 1) errors.bedrooms = "Mínimo 1 dormitorio";
  if (!form.bathrooms || Number(form.bathrooms) < 1) errors.bathrooms = "Mínimo 1 baño";
  if (!form.area || Number(form.area) <= 0) errors.area = "Ingresa un área válida";
  return errors;
}

const validForm: FormFields = {
  title: "Casa en Miraflores",
  description: "Hermosa casa con jardín",
  price: "450000",
  bedrooms: "3",
  bathrooms: "2",
  area: "150",
};

describe("validate (formulario nueva propiedad)", () => {
  it("no retorna errores con datos válidos", () => {
    expect(validate(validForm)).toEqual({});
  });

  it("retorna error si título está vacío", () => {
    const errors = validate({ ...validForm, title: "" });
    expect(errors.title).toBeDefined();
  });

  it("retorna error si título es solo espacios", () => {
    const errors = validate({ ...validForm, title: "   " });
    expect(errors.title).toBeDefined();
  });

  it("retorna error si descripción está vacía", () => {
    const errors = validate({ ...validForm, description: "" });
    expect(errors.description).toBeDefined();
  });

  it("retorna error si precio es 0", () => {
    const errors = validate({ ...validForm, price: "0" });
    expect(errors.price).toBeDefined();
  });

  it("retorna error si precio es negativo", () => {
    const errors = validate({ ...validForm, price: "-500" });
    expect(errors.price).toBeDefined();
  });

  it("retorna error si precio está vacío", () => {
    const errors = validate({ ...validForm, price: "" });
    expect(errors.price).toBeDefined();
  });

  it("retorna error si dormitorios es 0", () => {
    const errors = validate({ ...validForm, bedrooms: "0" });
    expect(errors.bedrooms).toBeDefined();
  });

  it("retorna error si baños es 0", () => {
    const errors = validate({ ...validForm, bathrooms: "0" });
    expect(errors.bathrooms).toBeDefined();
  });

  it("retorna error si área es 0", () => {
    const errors = validate({ ...validForm, area: "0" });
    expect(errors.area).toBeDefined();
  });

  it("retorna múltiples errores simultáneos", () => {
    const errors = validate({ title: "", description: "", price: "", bedrooms: "", bathrooms: "", area: "" });
    expect(Object.keys(errors)).toHaveLength(6);
  });

  it("no retorna error con precio decimal válido", () => {
    const errors = validate({ ...validForm, price: "99999.99" });
    expect(errors.price).toBeUndefined();
  });
});
