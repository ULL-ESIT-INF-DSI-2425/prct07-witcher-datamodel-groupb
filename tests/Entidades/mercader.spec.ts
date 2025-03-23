import { describe, test, expect, vi } from "vitest";
import Mercader from "../../src/Entidades/Mercader";
import inquirer from "inquirer";

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

vi.mock("inquirer", () => {
  return {
    default: {
      prompt: vi.fn(),
    },
  };
});

const getPromptMock = (): { mockResolvedValue: (val: unknown) => void } =>
  inquirer.prompt as unknown as { mockResolvedValue: (val: unknown) => void };

describe("Mercaderes - Método crear()", () => {
  test("crear() debe crear un mercader cuando se ingresan datos válidos", async () => {
    // Simulamos respuestas válidas
    getPromptMock().mockResolvedValue({
      _ID: "10",
      _nombre: "Vimme Vivaldi",
      _tipo: "Banca",
      _ubicacion: "Novigrado",
    });

    // Llamamos a crear(), que internamente usará el mock de inquirer
    Mercader.crear((mercader, error) => {
      expect(error).toBeUndefined();
      expect(mercader).toBeInstanceOf(Mercader);
      expect((mercader as Mercader).nombre).toBe("Vimme Vivaldi");
    });
  });

  test("crear() debe lanzar error si se ingresa un ID no numérico", async () => {
    // Simulamos respuesta inválida
    getPromptMock().mockResolvedValue({
      _ID: "no es un número",
      _nombre: "Vimme Vivaldi",
      _tipo: "Banca",
      _ubicacion: "Novigrado",
    });

    Mercader.crear((mercader, error) => {
      expect(mercader).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("El ID debe ser un número mayor a 0");
    });
  });

  test("crear() debe lanzar error si se ingresa un ID menor o igual a 0", async () => {
    // Simulamos respuesta inválida
    getPromptMock().mockResolvedValue({
      _ID: "0",
      _nombre: "Vimme Vivaldi",
      _tipo: "Banca",
      _ubicacion: "Novigrado",
    });

    Mercader.crear((mercader, error) => {
      expect(mercader).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("El ID debe ser un número mayor a 0");
    });
  });

  test("crear() debe lanzar error si se ingresa un nombre vacío", async () => {
    // Simulamos respuesta inválida
    getPromptMock().mockResolvedValue({
      _ID: "10",
      _nombre: "",
      _tipo: "Banca",
      _ubicacion: "Novigrado",
    });

    Mercader.crear((mercader, error) => {
      expect(mercader).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("El nombre no puede estar vacío");
    });
  });

  test("crear() debe lanzar error si se ingresa un tipo vacío", async () => {
    // Simulamos respuesta inválida
    getPromptMock().mockResolvedValue({
      _ID: "10",
      _nombre: "Vimme Vivaldi",
      _tipo: "",
      _ubicacion: "Novigrado",
    });

    Mercader.crear((mercader, error) => {
      expect(mercader).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("El tipo no puede estar vacío");
    });
  });

  test("crear() debe lanzar error si se ingresa una ubicación vacía", async () => {
    // Simulamos respuesta inválida
    getPromptMock().mockResolvedValue({
      _ID: "10",
      _nombre: "Vimme Vivaldi",
      _tipo: "Banca",
      _ubicacion: "",
    });

    Mercader.crear((mercader, error) => {
      expect(mercader).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("La ubicación no puede estar vacía");
    });
  });
});
