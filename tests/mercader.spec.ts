import { describe, test, expect } from "vitest";
import Mercader from "../src/Mercader";

describe("Mercader", () => {
  test("Los getters deben devolver los valores asignados", () => {
    const mercader = new Mercader(101, "Hattori", "Herrero", "Novigrado");
    expect(mercader.ID).toBe(101);
    expect(mercader.nombre).toBe("Hattori");
    expect(mercader.tipo).toBe("Herrero");
    expect(mercader.ubicacion).toBe("Novigrado");
  });

  test("El setter modifica el nombre correctamente", () => {
    const mercader = new Mercader(102, "Fergus", "Alquimista", "Velen");
    mercader.nombre = "Fergus Graem";
    expect(mercader.nombre).toBe("Fergus Graem");
  });
});
