import { describe, test, expect } from "vitest";
import { Bien } from "../src/Bienes";

describe("Bien", () => {
  test("Los getters deben devolver los valores asignados", () => {
    const bien = new Bien(
      1,
      "Espada de Acero",
      "Espada forjada en acero",
      "Acero",
      3.5,
      100,
    );
    expect(bien.getId()).toBe(1);
    expect(bien.getNombre()).toBe("Espada de Acero");
    expect(bien.getDescripcion()).toBe("Espada forjada en acero");
    expect(bien.getMaterial()).toBe("Acero");
    expect(bien.getPeso()).toBe(3.5);
    expect(bien.getValor()).toBe(100);
  });

  test("Setters deben modificar los valores correctamente", () => {
    const bien = new Bien(
      1,
      "Espada de Acero",
      "Espada forjada en acero",
      "Acero",
      3.5,
      100,
    );
    bien.setNombre("Espada de Plata");
    expect(bien.getNombre()).toBe("Espada de Plata");
  });
});
