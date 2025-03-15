import { describe, test, expect } from "vitest";
import Bien from "../src/Bien";

describe("Bien", () => {
  test("Los getters deben devolver los valores asignados", () => {
    const bien = new Bien(
      1,
      "Espada de Acero",
      "Espada forjada en acero",
      "Acero",
      3.5,
      100,
      1
    );
    expect(bien.ID).toBe(1);
    expect(bien.nombre).toBe("Espada de Acero");
    expect(bien.descripcion).toBe("Espada forjada en acero");
    expect(bien.material).toBe("Acero");
    expect(bien.peso).toBe(3.5);
    expect(bien.precio).toBe(100);
    expect(bien.cantidad).toBe(1);
  });

  test("Setters deben modificar los valores correctamente", () => {
    const bien = new Bien(
      1,
      "Espada de Acero",
      "Espada forjada en acero",
      "Acero",
      3.5,
      100,
      1
    );
    bien.nombre = "Espada de Plata";
    expect(bien.nombre).toBe("Espada de Plata");
  });
});
