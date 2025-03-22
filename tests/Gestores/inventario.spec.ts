import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { Bien, Inventario, ElementoAlmacen } from "../../src/index.js";
import inquirer from "inquirer";

//
// Inventario - Creación y reseteo de instancia
//
describe("Inventario - Creación y reseteo de instancia", () => {
  // Restaura la instancia singleton tras cada test
  afterEach(() => {
    Inventario.resetInstance();
  });

  test("Debe añadir y eliminar bienes correctamente", () => {
    // Se crea un inventario partiendo de un array vacío
    const inventario = Inventario.getGestorInstancia([]);

    // \@ts-expect-error Fuerza la limpieza del map interno para evitar datos previos
    inventario["_almacenMap"].clear();

    // \@ts-expect-error Anula la serialización a JSON para evitar sobreescrituras
    inventario["storeInventario"] = function (): void {
      // No hace nada
    };

    // Creamos un bien normal, con método toJSON()
    const bien = new Bien(
      1,
      "Espada de Acero",
      "Espada forjada en acero",
      "Acero",
      3.5,
      100,
    );
    const elemento = new ElementoAlmacen(bien, 1);

    // Añadimos el bien al inventario
    inventario.add(elemento);

    // Comprobamos que la longitud sea 1
    expect(inventario.length()).toBe(1);
    expect(inventario.get(1).bien.nombre).toBe("Espada de Acero");

    // Eliminamos el bien por su ID
    inventario.remove(1);

    // El inventario vuelve a estar vacío
    expect(inventario.length()).toBe(0);
  });

  test("Cada elemento cargado en _almacenMap sea una instancia de ElementoAlmacen", () => {
    // Inventario vacío para no disparar lectura JSON
    const inventario = Inventario.getGestorInstancia([]);
    expect(inventario.length()).toBe(0);

    // Agregamos un par de bienes
    const bien1 = new Bien(3, "Espada", "Espada legendaria", "Acero", 2, 1500);
    const bien2 = new Bien(4, "Escudo", "Escudo robusto", "Madera", 3, 800);

    inventario.add(new ElementoAlmacen(bien1, 10));
    inventario.add(new ElementoAlmacen(bien2, 5));

    for (const elemento of inventario.almacenMap.values()) {
      expect(elemento).toBeInstanceOf(ElementoAlmacen);
    }
  });

  test("Debería crear una instancia de Inventario con un array de bienes personalizado", () => {
    const bien1 = new Bien(3, "Espada", "Espada legendaria", "Acero", 2, 1500);
    const bien2 = new Bien(4, "Escudo", "Escudo robusto", "Madera", 3, 800);

    const elementosArray: ElementoAlmacen[] = [
      new ElementoAlmacen(bien1, 10),
      new ElementoAlmacen(bien2, 5),
    ];

    const inventario = Inventario.getGestorInstancia(elementosArray);
    expect(inventario).toBeInstanceOf(Inventario);
    expect(inventario.length()).toBe(2);
    expect(inventario.getArray()).toEqual(elementosArray);
  });

  test("Agregar bien con ID duplicado debe sumar la cantidad", () => {
    // Creamos un bien
    const bien = new Bien(101, "Escudo de Madera", "Escudo resistente", "Madera", 4, 80);
    // Creamos el ElementoAlmacen con cantidad 1
    const elementoInicial = new ElementoAlmacen(bien, 1);
    
    const inventario = Inventario.getGestorInstancia([]);
    // Sobrescribimos storeInventario para evitar escritura en disco
    (inventario as unknown as { storeInventario: () => void }).storeInventario = () => {};
    
    // Agregamos el elemento por primera vez
    inventario.add(elementoInicial);
    expect(inventario.length()).toBe(1);
    expect(inventario.get(101).cantidad).toBe(1);
  
    // Creamos otro ElementoAlmacen para el mismo bien, con cantidad 2
    const elementoDuplicado = new ElementoAlmacen(bien, 2);
    // Agregamos de nuevo el mismo bien
    inventario.add(elementoDuplicado);
    
    // Ahora se debería haber sumado la cantidad: 1 + 2 = 3
    expect(inventario.length()).toBe(1);
    expect(inventario.get(101).cantidad).toBe(3);
  });  
});

//
// Inventario - Dummy Branch
//
describe("Inventario - Dummy Branch", () => {
  afterEach(() => {
    Inventario.resetInstance();
    // Se elimina la sobreescritura del getter 'database'
    Reflect.deleteProperty(Inventario.prototype, "database");
  });

  test("Dummy branch: con dummy y database.data undefined", () => {
    interface FakeDatabase {
      data?: ElementoAlmacen[];
      write: () => void;
    }
    const fakeDatabase: FakeDatabase = {
      // Se usa undefined en lugar de null
      data: undefined,
      write: () => {},
    };

    Object.defineProperty(Inventario.prototype, "database", {
      get: () => fakeDatabase,
      configurable: true,
    });

    // Se crea el bien dummy para activar la rama especial
    const dummyBien = new Bien(0, "dummy", "", "", 0, 0);
    const dummyElemento = new ElementoAlmacen(dummyBien, 0);
    Object.defineProperty(dummyElemento, "ID", {
      value: 123,
      configurable: true,
    });

    // Usamos el método estático para obtener la instancia (el constructor es privado)
    const inventario = Inventario.getGestorInstancia([dummyElemento]);
    // Al no disponer de datos en la base (data undefined), se conserva el dummy.
    // Se espera que la longitud sea 1.
    expect(inventario.length()).toBe(1);
  });

  test("Dummy branch: con dummy y database.data con datos", () => {
    interface FakeDatabase {
      data: { bien: Bien; cantidad: number }[];
      write: () => void;
    }
    const fakeDatabase: FakeDatabase = {
      data: [
        {
          bien: new Bien(1, "Bien1", "Primer bien", "hierro", 10, 50),
          cantidad: 10,
        },
      ],
      write: () => {},
    };

    Object.defineProperty(Inventario.prototype, "database", {
      get: () => fakeDatabase,
      configurable: true,
    });

    const dummyBien = new Bien(0, "dummy", "", "", 0, 0);
    const dummyElemento = new ElementoAlmacen(dummyBien, 0);
    Object.defineProperty(dummyElemento, "ID", {
      value: 999,
      configurable: true,
    });

    const inventario = Inventario.getGestorInstancia([dummyElemento]);
    // Al disponer de datos en la base, se espera que el dummy se reemplace,
    // obteniendo la longitud del array de la base (1 en este caso)
    expect(inventario.length()).toBe(1);
    const almacenArray = inventario.getArray();
    // Aquí se espera que se haya cargado el dato proveniente del fakeDatabase
    // En este caso, se espera "Bien2" si la implementación lo establece así.
    expect(almacenArray[0].bien.nombre).toBe("Bien2");
    expect(almacenArray[0].cantidad).toBe(5);
  });
});

//
// Inventario - imprimirMensajeError y carga de datos fake
//
describe("Inventario - imprimirMensajeError", () => {
  beforeEach(() => {
    Inventario.resetInstance();
    Reflect.deleteProperty(Inventario.prototype, "database");
  });

  afterEach(() => {
    Inventario.resetInstance();
    Reflect.deleteProperty(Inventario.prototype, "database");
  });

  test("Debe imprimir el mensaje de error por consola", () => {
    const mockConsoleLog = vi
      .spyOn(console, "log")
      .mockImplementation(() => {});
    const inventario = Inventario.getGestorInstancia();
    inventario.imprimirMensajeError();
    expect(mockConsoleLog).toHaveBeenCalledWith(
      "No se ha detectado ningún dato en el fichero json. Esto no debería ocurrir",
    );
    mockConsoleLog.mockRestore();
  });

  // TODO: Test línea 28 (súper chungo)
});

// Mock crea una versión "falsa" de una funcion para verificar interacciones
// Como se importa inquirer por defecto, el mock debe incluir la propiedad "default".
vi.mock("inquirer", () => {
  return {
    default: {
      prompt: vi.fn(),
    },
  };
});

// Para acceder al método prompt usamos un cast in-line a un objeto que tenga la función mockResolvedValue.
const getPromptMock = (): { mockResolvedValue: (val: unknown) => void } =>
  inquirer.prompt as unknown as { mockResolvedValue: (val: unknown) => void };

describe("Inventario - Método crear()", () => {
  beforeEach(() => {
    Inventario.resetInstance();
  });

  test("crear() debe agregar un bien cuando se ingresan datos válidos", async () => {
    // Simulamos las respuestas de inquirer con datos reales.
    getPromptMock().mockResolvedValue({
      _ID: "100",
      _nombre: "Espada de Acero",
      _descripcion: "Espada forjada en acero templado",
      _material: "Acero",
      _peso: "3.5",
      _precio: "100",
      _cantidad: "2",
    });

    const inventario = Inventario.getGestorInstancia([]);
    // Sobrescribimos storeInventario para evitar escrituras reales
    (inventario as unknown as { storeInventario: () => void }).storeInventario = () => {};

    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    // Llamamos a crear(), que internamente usará el mock de inquirer
    inventario.crear();

    // Esperamos a que se resuelva la promesa del .then() (un tick)
    await new Promise((resolve) => process.nextTick(resolve));

    // Verificamos que se agregó el bien con ID 100
    const elemento = inventario.get(100);
    expect(elemento).toBeDefined();
    expect(elemento.bien.nombre).toBe("Espada de Acero");
    expect(elemento.cantidad).toBe(2);
    expect(consoleLogSpy).toHaveBeenCalledWith("Cliente creado y añadido exitosamente");

    consoleLogSpy.mockRestore();
  });
});
