import { describe, test, expect, vi } from "vitest";
import inquirer from "inquirer";
import Cliente from "../../src/Entidades/Cliente";

describe("Cliente", () => {
  test("Los getters deben devolver los valores asignados", () => {
    const cliente = new Cliente(201, "Aragorn", "Humano", "Rohan");
    expect(cliente.ID).toBe(201);
    expect(cliente.nombre).toBe("Aragorn");
    expect(cliente.raza).toBe("Humano");
    expect(cliente.ubicacion).toBe("Rohan");
  });

  test("debería permitir modificar el nombre", () => {
    const cliente = new Cliente(2, "Ciri", "Elfo", "Vizima");
    cliente.nombre = "Cirilla Fiona";
    expect(cliente.nombre).toBe("Cirilla Fiona");
  });

  test("debería permitir modificar la raza", () => {
    const cliente = new Cliente(3, "Yennefer", "Humana", "Novigrado");
    cliente.raza = "Hechicero";
    expect(cliente.raza).toBe("Hechicero");
  });

  test("debería permitir modificar la ubicación", () => {
    const cliente = new Cliente(4, "Triss Merigold", "Humana", "Vizima");
    cliente.ubicacion = "Novigrado";
    expect(cliente.ubicacion).toBe("Novigrado");
  });

  test("debería crear múltiples instancias de Cliente y mantener sus propiedades de forma independiente", () => {
    const cliente1 = new Cliente(6, "Eskel", "Humano", "Kaer Morhen");
    const cliente2 = new Cliente(7, "Lambert", "Humano", "Kaer Morhen");
    cliente1.nombre = "Eskel Actualizado";
    cliente2.ubicacion = "Vizima";
    expect(cliente1.nombre).toBe("Eskel Actualizado");
    expect(cliente2.ubicacion).toBe("Vizima");
    expect(cliente1.ID).not.toBe(cliente2.ID);
  });

  test("debería permitir modificar secuencialmente nombre, raza y ubicación", () => {
    const cliente = new Cliente(8, "Dandelion", "Humano", "Novigrado");
    cliente.nombre = "Dandelion el Bardo";
    expect(cliente.nombre).toBe("Dandelion el Bardo");
    cliente.raza = "Bardo";
    expect(cliente.raza).toBe("Bardo");
    cliente.ubicacion = "Vizima";
    expect(cliente.ubicacion).toBe("Vizima");
  });

  test("debería permitir asignar cadenas vacías o con espacios a nombre, raza y ubicación", () => {
    const cliente = new Cliente(9, "Original", "Original", "Original");
    cliente.nombre = "";
    cliente.raza = "   ";
    cliente.ubicacion = "";
    expect(cliente.nombre).toBe("");
    expect(cliente.raza).toBe("   ");
    expect(cliente.ubicacion).toBe("");
  });

  test("debería permitir asignar caracteres especiales a las propiedades", () => {
    const cliente = new Cliente(10, "Cliente", "Raza", "Ubicación");
    cliente.nombre = "@#$%^&*()";
    cliente.raza = "Elfo-ñ";
    cliente.ubicacion = "Ciudad: *&%$#@!";
    expect(cliente.nombre).toBe("@#$%^&*()");
    expect(cliente.raza).toBe("Elfo-ñ");
    expect(cliente.ubicacion).toBe("Ciudad: *&%$#@!");
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

describe("Clientes - Método crear()", () => {

  test("crear() debe crear un cliente cuando se ingresan datos válidos", async () => {
    // Simulamos respuestas válidas
    getPromptMock().mockResolvedValue({
      _ID: "10",
      _nombre: "Geralt de Rivia",
      _raza: "Humano",
      _ubicacion: "Kaer Morhen",
    });

    // Llamamos a crear(), que internamente usará el mock de inquirer
    Cliente.crear((cliente, error) => {
      expect(error).toBeUndefined();
      expect(cliente).toBeInstanceOf(Cliente);
      expect((cliente as Cliente).nombre).toBe("Geralt de Rivia");
    });
  });

  test("crear() debe lanzar error si se ingresa un ID no numérico", async () => {
    // Simulamos respuesta inválida
    getPromptMock().mockResolvedValue({
      _ID: "no es un número",
      _nombre: "Ciri",
      _raza: "Elfo",
      _ubicacion: "Vizima",
    });

    // Llamamos a crear(), que internamente usará el mock de inquirer
    Cliente.crear((cliente, error) => {
      expect(cliente).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("El ID debe ser un número mayor a 0");
    });
  });

  test("crear() debe lanzar error si se ingresa un ID menor o igual a 0", async () => {
    // Simulamos respuesta inválida
    getPromptMock().mockResolvedValue({
      _ID: "0",
      _nombre: "Triss",
      _raza: "Hechicero",
      _ubicacion: "Vizima",
    });

    // Llamamos a crear(), que internamente usará el mock de inquirer
    Cliente.crear((cliente, error) => {
      expect(cliente).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("El ID debe ser un número mayor a 0");
    });
  });
  

  test("crear() debe lanzar error si se ingresa un nombre vacío", async () => {
    // Simulamos respuesta inválida
    getPromptMock().mockResolvedValue({
      _ID: "20",
      _nombre: "",
      _raza: "Elfo",
      _ubicacion: "Vizima",
    });

    // Llamamos a crear(), que internamente usará el mock de inquirer
    Cliente.crear((cliente, error) => {
      expect(cliente).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("El nombre no puede estar vacío");
    });
  });

  
  test("crear() debe lanzar error si se ingresa una raza vacía", async () => {
    // Simulamos respuesta inválida
    getPromptMock().mockResolvedValue({
      _ID: "30",
      _nombre: "Triss",
      _raza: "",
      _ubicacion: "Vizima",
    });

    // Llamamos a crear(), que internamente usará el mock de inquirer
    Cliente.crear((cliente, error) => {
      expect(cliente).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("La raza no puede estar vacía");
    });
  });

  test("crear() debe lanzar error si se ingresa una ubicación vacía", async () => {
    // Simulamos respuesta inválida
    getPromptMock().mockResolvedValue({
      _ID: "40",
      _nombre: "Yennefer",
      _raza: "Hechicero",
      _ubicacion: "",
    });

    // Llamamos a crear(), que internamente usará el mock de inquirer
    Cliente.crear((cliente, error) => {
      expect(cliente).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("La ubicación no puede estar vacía");
    });
  });
  
});
