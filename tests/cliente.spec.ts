import { describe, test, expect } from "vitest";
import Cliente from "../src/Cliente";

describe("Cliente", () => {
  test("Los getters deben devolver los valores asignados", () => {
    const cliente = new Cliente(201, "Aragorn", "Humano", "Rohan");
    expect(cliente.ID).toBe(201);
    expect(cliente.nombre).toBe("Aragorn");
    expect(cliente.raza).toBe("Humano");
    expect(cliente.ubicacion).toBe("Rohan");
  });

  test("El setter modifica el nombre correctamente", () => {
    const cliente = new Cliente(202, "Legolas", "Elfo", "Mirkwood");
    cliente.nombre = "Legolas Greenleaf";
    expect(cliente.nombre).toBe("Legolas Greenleaf");
  });

});
