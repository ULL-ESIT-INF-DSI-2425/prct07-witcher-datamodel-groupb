import { describe, test, expect,beforeEach, afterEach, vi } from "vitest";
import inquirer from "inquirer";
import GestorClientes from "../../src/Gestores/GestorClientes";
import Cliente from "../../src/Entidades/Cliente";

describe("GestorClientes", () => {
  afterEach(() => {
    GestorClientes.resetInstance();
  });

  test("debería crear una instancia de GestorClientes con un array de clientes personalizado", () => {
    const cliente1 = new Cliente(1, "Geralt de Rivia", "Humano", "Kaer Morhen");
    const cliente2 = new Cliente(2, "Ciri", "Elfo", "Vizima");
    const clientesArray: Cliente[] = [cliente1, cliente2];

    const gestorClientes = GestorClientes.getGestorInstancia(clientesArray);
    expect(gestorClientes).toBeInstanceOf(GestorClientes);

    expect(gestorClientes.length()).toBe(2);
    expect(gestorClientes.getArray()).toEqual(clientesArray);
  });

  test("debería crear una instancia de GestorClientes con un array vacío personalizado", () => {
    const gestorClientes = GestorClientes.getGestorInstancia([]);
    expect(gestorClientes).toBeInstanceOf(GestorClientes);

    expect(gestorClientes.length()).toBe(0);
    expect(gestorClientes.getArray()).toEqual([]);
  });

  // Pruebas adicionales de la funcionalidad heredada de Gestor

  test("debería agregar un cliente con add() y aumentar el tamaño", () => {
    const gestorClientes = GestorClientes.getGestorInstancia([]);
    expect(gestorClientes.length()).toBe(0);

    const nuevoCliente = new Cliente(3, "Yennefer", "Hechicero", "Novigrado");
    gestorClientes.add(nuevoCliente);
    expect(gestorClientes.length()).toBe(1);
    expect(gestorClientes.get(3)).toEqual(nuevoCliente);

    expect(gestorClientes.getArray()).toEqual([nuevoCliente]);
  });

  test("debería lanzar error al agregar un cliente con ID duplicado", () => {
    const cliente1 = new Cliente(4, "Triss", "Humana", "Vizima");
    const gestorClientes = GestorClientes.getGestorInstancia([cliente1]);
    expect(() => gestorClientes.add(cliente1)).toThrow(
      "Error, ID 4 ya está en uso",
    );
  });

  test("debería eliminar un cliente con remove() y disminuir el tamaño", () => {
    const cliente1 = new Cliente(5, "Dandelion", "Bardo", "Novigrado");
    const cliente2 = new Cliente(6, "Eskel", "Humano", "Kaer Morhen");
    const gestorClientes = GestorClientes.getGestorInstancia([
      cliente1,
      cliente2,
    ]);

    expect(gestorClientes.length()).toBe(2);
    gestorClientes.remove(5);
    expect(gestorClientes.length()).toBe(1);
    expect(() => gestorClientes.get(5)).toThrow("Bien con ID 5 no encontrado.");
  });

  test("ImprimirTest() debe recorrer todos los clientes e imprimir sus nombres", () => {
    const cliente1 = new Cliente(7, "Lambert", "Humano", "Kaer Morhen");
    const cliente2 = new Cliente(8, "Eskel", "Humano", "Kaer Morhen");
    const gestorClientes = GestorClientes.getGestorInstancia([
      cliente1,
      cliente2,
    ]);

    // Guardamos la función original de console.log
    const originalLog = console.log;
    // Creamos un array para capturar los mensajes
    const logs: string[] = [];
    // Sobrescribimos console.log para que almacene los mensajes en el array
    console.log = (msg: string) => {
      logs.push(msg);
    };

    // Llamamos al método que queremos testear
    gestorClientes.ImprimirTest();

    // Restauramos la función original
    console.log = originalLog;

    // Verificamos que los mensajes esperados se encuentren en el array
    expect(logs).toContain("Lambert");
    expect(logs).toContain("Eskel");
  });
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

// Para acceder a prompt y poder llamar a mockResolvedValue sin definir una interfaz separada,
// usamos un cast inline a un objeto con la propiedad mockResolvedValue:
const getPromptMock = (): { mockResolvedValue: (val: unknown) => void } =>
  inquirer.prompt as unknown as { mockResolvedValue: (val: unknown) => void };

describe("GestorClientes - Método crear()", () => {
  beforeEach(() => {
    GestorClientes.resetInstance();
  });

  test("crear() debe agregar un cliente cuando se ingresan datos válidos", async () => {
    // Simulamos respuestas válidas
    getPromptMock().mockResolvedValue({
      _ID: "10",
      _nombre: "Geralt de Rivia",
      _raza: "Humano",
      _ubicacion: "Kaer Morhen",
    });

    const gestor = GestorClientes.getGestorInstancia([]);
    // Evitamos efectos secundarios sobrescribiendo storeInventario para que no escriba en disco.
    (gestor as unknown as { storeInventario: () => void }).storeInventario = () => {};

    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    // Llamamos a crear(), que internamente usará el mock de inquirer
    gestor.crear();
    // Esperamos a que se resuelvan las promesas internas
    await new Promise((resolve) => process.nextTick(resolve));

    // Verificamos que se agregó un cliente con ID 10
    const cliente = gestor.get(10);
    expect(cliente).toBeInstanceOf(Cliente);
    expect(cliente.nombre).toBe("Geralt de Rivia");
    expect(consoleLogSpy).toHaveBeenCalledWith("Cliente creado y añadido exitosamente");
    consoleLogSpy.mockRestore();
  });

  test("crear() debe mostrar error cuando se ingresa un ID duplicado", async () => {
    // Simulamos respuestas con un ID duplicado
    getPromptMock().mockResolvedValue({
      _ID: "11",
      _nombre: "Ciri",
      _raza: "Elfo",
      _ubicacion: "Vizima",
    });

    const gestor = GestorClientes.getGestorInstancia([]);
    (gestor as unknown as { storeInventario: () => void }).storeInventario = () => {};
    // Preagregamos un cliente con ID 11 para forzar duplicidad
    const preCliente = new Cliente(11, "Ciri", "Elfo", "Vizima");
    gestor.add(preCliente);

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    gestor.crear();
    await new Promise((resolve) => process.nextTick(resolve));

    // Verificamos que se haya llamado a console.error con el mensaje exacto.
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error, ID 11 ya está en uso");
    consoleErrorSpy.mockRestore();
  });
});
