import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import inquirer from "inquirer";
import GestorMercaderes from "../../src/Gestores/GestorMercaderes";
import Mercader from "../../src/Entidades/Mercader";

describe("GestorMercaderes", () => {
  afterEach(() => {
    GestorMercaderes.resetInstance();
  });

  test("debería crear una instancia de GestorMercaderes con un array de mercaderes personalizado", () => {
    const mercader1 = new Mercader(1, "Hattori", "Herrero", "Novigrado");
    const mercader2 = new Mercader(
      2,
      "Fergus Graem",
      "Mercader General",
      "Velen",
    );
    const mercaderesArray = [mercader1, mercader2];

    const gestorMercaderes =
      GestorMercaderes.getGestorInstancia(mercaderesArray);
    expect(gestorMercaderes).toBeInstanceOf(GestorMercaderes);

    expect(gestorMercaderes.length()).toBe(2);

    expect(gestorMercaderes.getArray()).toEqual(mercaderesArray);
  });

  test("debería crear una instancia de GestorMercaderes con un array vacío personalizado", () => {
    const gestorMercaderes = GestorMercaderes.getGestorInstancia([]);
    expect(gestorMercaderes).toBeInstanceOf(GestorMercaderes);

    expect(gestorMercaderes.length()).toBe(0);

    expect(gestorMercaderes.getArray()).toEqual([]);
  });

  // Pruebas adicionales de la funcionalidad heredada de Gestor

  test("debería agregar un mercader con add() y aumentar el tamaño", () => {
    const gestorMercaderes = GestorMercaderes.getGestorInstancia([]);
    expect(gestorMercaderes.length()).toBe(0);
    const nuevoMercader = new Mercader(
      3,
      "Mercader X",
      "Mercader General",
      "Velen",
    );
    gestorMercaderes.add(nuevoMercader);
    expect(gestorMercaderes.length()).toBe(1);
    expect(gestorMercaderes.get(3)).toEqual(nuevoMercader);

    expect(gestorMercaderes.getArray()).toEqual([nuevoMercader]);
  });

  test("debería lanzar error al agregar un mercader con ID duplicado", () => {
    const mercader1 = new Mercader(4, "Mercader Y", "Herrero", "Novigrado");
    const gestorMercaderes = GestorMercaderes.getGestorInstancia([mercader1]);
    expect(() => gestorMercaderes.add(mercader1)).toThrow(
      "Error, ID 4 ya está en uso",
    );
  });

  test("debería eliminar un mercader con remove() y disminuir el tamaño", () => {
    const mercader1 = new Mercader(5, "Mercader Z", "Alquimista", "Velen");
    const mercader2 = new Mercader(6, "Mercader W", "Herrero", "Novigrado");
    const gestorMercaderes = GestorMercaderes.getGestorInstancia([
      mercader1,
      mercader2,
    ]);
    expect(gestorMercaderes.length()).toBe(2);
    gestorMercaderes.remove(5);
    expect(gestorMercaderes.length()).toBe(1);
    expect(() => gestorMercaderes.get(5)).toThrow(
      "Bien con ID 5 no encontrado.",
    );
  });

  test("ImprimirTest() debe recorrer todos los mercaderes e imprimir sus nombres", () => {
    const mercader1 = new Mercader(7, "Hattori", "Herrero", "Novigrado");
    const mercader2 = new Mercader(
      8,
      "Fergus Graem",
      "Mercader General",
      "Velen",
    );
    const gestorMercaderes = GestorMercaderes.getGestorInstancia([
      mercader1,
      mercader2,
    ]);

    // Guardamos la función original de console.log
    const originalLog = console.log;
    // Creamos un array para capturar los mensajes
    const logs: string[] = [];
    // Sobrescribimos console.log para capturar los mensajes en el array
    console.log = (msg: string) => {
      logs.push(msg);
    };

    // Ejecutamos el método que queremos testear
    gestorMercaderes.ImprimirTest();

    // Restauramos la función original
    console.log = originalLog;

    // Verificamos que se hayan impreso los nombres esperados
    expect(logs).toContain("Hattori");
    expect(logs).toContain("Fergus Graem");
  });
});

// Mock crea una versión "falsa" de una funcion para verificar interacciones
// Como se importa inquirer por defecto, el mock debe incluir la propiedad "default".
vi.mock("inquirer", () => {
  return {
    default: {
      prompt: vi.fn()
    }
  };
});

// Para acceder a prompt y usar mockResolvedValue sin definir una interfaz separada, usamos un cast inline:
const getPromptMock = (): { mockResolvedValue: (val: unknown) => void } =>
  inquirer.prompt as unknown as { mockResolvedValue: (val: unknown) => void };

describe("GestorMercaderes - Método crear()", () => {
  beforeEach(() => {
    GestorMercaderes.resetInstance();
  });

  test("crear() debe agregar un mercader cuando se ingresan datos válidos", async () => {
    // Simulamos respuestas válidas para un mercader.
    // Asegúrate de que los nombres de las propiedades (_ID, _nombre, _tipo, _ubicacion)
    // sean los que tu implementación utiliza.
    getPromptMock().mockResolvedValue({
      _ID: "20",
      _nombre: "Hattori",
      _tipo: "Herrero",
      _ubicacion: "Novigrado"
    });

    const gestor = GestorMercaderes.getGestorInstancia([]);
    // Evitamos efectos secundarios sobrescribiendo storeInventario para que no escriba a disco.
    (gestor as unknown as { storeInventario: () => void }).storeInventario = () => {};
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    // Llamamos al método crear(), que internamente usa el prompt simulado.
    gestor.crear();
    // Esperamos a que se resuelvan las promesas internas (un tick).
    await new Promise((resolve) => process.nextTick(resolve));

    // Verificamos que se agregó un mercader con ID 20 y que su nombre es "Hattori".
    const mercader = gestor.get(20);
    expect(mercader).toBeInstanceOf(Mercader);
    expect(mercader.nombre).toBe("Hattori");

    // Se espera que se imprima un mensaje de éxito.
    // Asegúrate de que en tu implementación el mensaje sea exactamente este,
    // por ejemplo: "Mercader creado y añadido exitosamente"
    expect(consoleLogSpy).toHaveBeenCalledWith("Mercader creado y añadido exitosamente");
    consoleLogSpy.mockRestore();
  });

  test("crear() debe mostrar error cuando se ingresa un ID duplicado", async () => {
    // Simulamos respuestas con un ID duplicado.
    getPromptMock().mockResolvedValue({
      _ID: "21",
      _nombre: "Fergus Graem",
      _tipo: "Mercader General",
      _ubicacion: "Velen"
    });

    const gestor = GestorMercaderes.getGestorInstancia([]);
    (gestor as unknown as { storeInventario: () => void }).storeInventario = () => {};
    // Preagregamos un mercader con ID 21 para forzar duplicidad.
    const mercaderPre = new Mercader(21, "Fergus Graem", "Mercader General", "Velen");
    gestor.add(mercaderPre);

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    gestor.crear();
    await new Promise((resolve) => process.nextTick(resolve));

    // Se espera que se llame a console.error con el mensaje de error exacto.
    // Asegúrate de que tu implementación lance el mensaje: "Error, ID 21 ya está en uso"
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error, ID 21 ya está en uso");
    consoleErrorSpy.mockRestore();
  });
});

