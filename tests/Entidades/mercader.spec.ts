import { describe, test, expect } from "vitest";
import Mercader from "../../src/Entidades/Mercader";

describe("Mercader", () => {
  test("Los getters deben devolver los valores asignados", () => {
    const mercader = new Mercader(101, "Hattori", "Herrero", "Novigrado");
    expect(mercader.ID).toBe(101);
    expect(mercader.nombre).toBe("Hattori");
    expect(mercader.tipo).toBe("Herrero");
    expect(mercader.ubicacion).toBe("Novigrado");
  });

  test("debería permitir modificar el nombre del mercader", () => {
    const mercader = new Mercader(
      2,
      "Fergus Graem",
      "Mercader General",
      "Velen",
    );
    mercader.nombre = "Fergus Modificado";
    expect(mercader.nombre).toBe("Fergus Modificado");
  });

  test("debería permitir modificar el tipo del mercader", () => {
    const mercader = new Mercader(3, "Hattori", "Herrero", "Novigrado");
    mercader.tipo = "Alquimista";
    expect(mercader.tipo).toBe("Alquimista");
  });

  test("debería permitir modificar la ubicación del mercader", () => {
    const mercader = new Mercader(
      4,
      "Mercader X",
      "Mercader General",
      "Kaer Trolde",
    );
    mercader.ubicacion = "Velen";
    expect(mercader.ubicacion).toBe("Velen");
  });

  test("debería crear múltiples instancias de Mercader y mantener sus propiedades de forma independiente", () => {
    const mercader1 = new Mercader(
      6,
      "Mercader Uno",
      "Alquimista",
      "Novigrado",
    );
    const mercader2 = new Mercader(7, "Mercader Dos", "Herrero", "Velen");
    mercader1.nombre = "Mercader Uno Actualizado";
    mercader2.ubicacion = "Kaer Trolde";
    expect(mercader1.nombre).toBe("Mercader Uno Actualizado");
    expect(mercader2.ubicacion).toBe("Kaer Trolde");
    expect(mercader1.ID).not.toBe(mercader2.ID);
  });

  test("debería permitir modificar secuencialmente nombre, tipo y ubicación", () => {
    const mercader = new Mercader(
      8,
      "Original",
      "Mercader General",
      "Novigrado",
    );
    mercader.nombre = "Actualizado";
    expect(mercader.nombre).toBe("Actualizado");
    mercader.tipo = "Alquimista";
    expect(mercader.tipo).toBe("Alquimista");
    mercader.ubicacion = "Velen";
    expect(mercader.ubicacion).toBe("Velen");
  });

  test("debería permitir asignar cadenas vacías o con espacios a nombre, tipo y ubicación", () => {
    const mercader = new Mercader(9, "Mercader", "Tipo", "Ubicación");
    mercader.nombre = "";
    mercader.tipo = "   ";
    mercader.ubicacion = "";
    expect(mercader.nombre).toBe("");
    expect(mercader.tipo).toBe("   ");
    expect(mercader.ubicacion).toBe("");
  });

  test("debería permitir asignar caracteres especiales a las propiedades", () => {
    const mercader = new Mercader(10, "Mercader", "Tipo", "Ubicación");
    mercader.nombre = "@#$%^&*()";
    mercader.tipo = "Tipo-ñ";
    mercader.ubicacion = "Ciudad: *&%$#@!";
    expect(mercader.nombre).toBe("@#$%^&*()");
    expect(mercader.tipo).toBe("Tipo-ñ");
    expect(mercader.ubicacion).toBe("Ciudad: *&%$#@!");
  });
});
