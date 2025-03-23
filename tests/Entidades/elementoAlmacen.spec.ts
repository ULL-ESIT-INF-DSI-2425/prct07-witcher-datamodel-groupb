import { describe, test, expect, vi } from "vitest";
import ElementoAlmacen from "../../src/Entidades/ElementoAlmacen";
import Bien from "../../src/Entidades/Bien";
import inquirer from "inquirer";

describe("ElementoAlmacen", () => {
  test("Los getters deben devolver los valores asignados", () => {
    const bien = new Bien(101, "Espada de plata", "Espada para monstruos", "Acero", 2.5, 100);
    const elemento = new ElementoAlmacen(bien, 10);
    expect(elemento.ID).toBe(101);
    expect(elemento.bien.nombre).toBe("Espada de plata");
    expect(elemento.cantidad).toBe(10);
  });

  test("debería permitir modificar la cantidad del elemento", () => {
    const bien = new Bien(102, "Poción de curación", "Restaura salud", "Líquido", 0.1, 50);
    const elemento = new ElementoAlmacen(bien, 5);
    elemento.cantidad = 20;
    expect(elemento.cantidad).toBe(20);
  });

  test("debería crear múltiples instancias de ElementoAlmacen y mantener sus propiedades de forma independiente", () => {
    const bien1 = new Bien(103, "Armadura de cuero", "Protección ligera", "Cuero", 5, 200);
    const bien2 = new Bien(104, "Botas de cuero", "Protección para los pies", "Cuero", 1, 50);
    const elemento1 = new ElementoAlmacen(bien1, 3);
    const elemento2 = new ElementoAlmacen(bien2, 7);
    elemento1.cantidad = 10;
    elemento2.cantidad = 15;
    expect(elemento1.cantidad).toBe(10);
    expect(elemento2.cantidad).toBe(15);
    expect(elemento1.ID).not.toBe(elemento2.ID);
  });

  test("debería permitir modificar secuencialmente la cantidad", () => {
    const bien = new Bien(105, "Escudo de madera", "Protección básica", "Madera", 3, 75);
    const elemento = new ElementoAlmacen(bien, 2);
    elemento.cantidad = 5;
    expect(elemento.cantidad).toBe(5);
    elemento.cantidad = 8;
    expect(elemento.cantidad).toBe(8);
  });

  test("debería permitir asignar cantidades negativas o cero", () => {
    const bien = new Bien(106, "Casco de hierro", "Protección para la cabeza", "Hierro", 2, 150);
    const elemento = new ElementoAlmacen(bien, 1);
    elemento.cantidad = 0;
    expect(elemento.cantidad).toBe(0);
    elemento.cantidad = -5;
    expect(elemento.cantidad).toBe(-5);
  });

  test("debería permitir asignar caracteres especiales a las propiedades del bien", () => {
    const bien = new Bien(107, "@#$%^&*()", "Descripción con caracteres especiales", "Material-ñ", 1.5, 100);
    const elemento = new ElementoAlmacen(bien, 10);
    expect(elemento.bien.nombre).toBe("@#$%^&*()");
    expect(elemento.bien.descripcion).toBe("Descripción con caracteres especiales");
    expect(elemento.bien.material).toBe("Material-ñ");
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

describe("ElementosAlmacen - Método crear()", () => {
  test("crear() debe crear un elemento de almacén cuando se ingresan datos válidos", async () => {
    // Simulamos respuestas válidas
    getPromptMock().mockResolvedValue({
      _ID: "10",
      _nombre: "Espada de plata",
      _descripcion: "Espada para monstruos",
      _material: "Acero",
      _peso: "2.5",
      _precio: "100",
      _cantidad: "10",
    });

    // Llamamos a crear(), que internamente usará el mock de inquirer
    ElementoAlmacen.crear((elemento, error) => {
      expect(error).toBeUndefined();
      expect(elemento).toBeInstanceOf(ElementoAlmacen);
      expect((elemento as ElementoAlmacen).bien.nombre).toBe("Espada de plata");
    });
  });

  test("crear() debe lanzar error si se ingresa un ID no numérico", async () => {
    // Simulamos respuesta inválida
    getPromptMock().mockResolvedValue({
      _ID: "no es un número",
      _nombre: "Espada de plata",
      _descripcion: "Espada para monstruos",
      _material: "Acero",
      _peso: "2.5",
      _precio: "100",
      _cantidad: "10",
    });

    ElementoAlmacen.crear((elemento, error) => {
      expect(elemento).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("El ID debe ser un número mayor a 0"); 
    });
  });

  test("crear() debe lanzar error si se ingresa un ID menor o igual a 0", async () => {
    // Simulamos respuesta inválida
    getPromptMock().mockResolvedValue({
      _ID: "0",
      _nombre: "Espada de plata",
      _descripcion: "Espada para monstruos",
      _material: "Acero",
      _peso: "2.5",
      _precio: "100",
      _cantidad: "10",
    });

    ElementoAlmacen.crear((elemento, error) => {
      expect(elemento).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("El ID debe ser un número mayor a 0");
    });
  });

  test("crear() debe lanzar error si se ingresa un nombre vacío", async () => {
    // Simulamos respuesta inválida
    getPromptMock().mockResolvedValue({
      _ID: "10",
      _nombre: "",
      _descripcion: "Espada para monstruos",
      _material: "Acero",
      _peso: "2.5",
      _precio: "100",
      _cantidad: "10",
    });

    ElementoAlmacen.crear((elemento, error) => {
      expect(elemento).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("El nombre no puede estar vacío");
    });
  });

  test("crear() debe lanzar error si se ingresa una descripción vacía", async () => {
    // Simulamos respuesta inválida
    getPromptMock().mockResolvedValue({
      _ID: "10",
      _nombre: "Espada de plata",
      _descripcion: "",
      _material: "Acero",
      _peso: "2.5",
      _precio: "100",
      _cantidad: "10",
    });

    ElementoAlmacen.crear((elemento, error) => {
      expect(elemento).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("La descripción no puede estar vacía");
    });
  });

  test("crear() debe lanzar error si se ingresa un material vacío", async () => {
    // Simulamos respuesta inválida
    getPromptMock().mockResolvedValue({
      _ID: "10",
      _nombre: "Espada de plata",
      _descripcion: "Espada para monstruos",
      _material: "",
      _peso: "2.5",
      _precio: "100",
      _cantidad: "10",
    });

    ElementoAlmacen.crear((elemento, error) => {
      expect(elemento).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("El material no puede estar vacío");
    });
  });

  test("crear() debe lanzar error si se ingresa un peso no válido", async () => {
    // Simulamos respuesta inválida
    getPromptMock().mockResolvedValue({
      _ID: "10",
      _nombre: "Espada de plata",
      _descripcion: "Espada para monstruos",
      _material: "Acero",
      _peso: "no es un número",
      _precio: "100",
      _cantidad: "10",
    });

    ElementoAlmacen.crear((elemento, error) => {
      expect(elemento).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("El peso debe ser un número mayor que 0");
    });
  });

  test("crear() debe lanzar error si se ingresa un precio no válido", async () => {
    // Simulamos respuesta inválida
    getPromptMock().mockResolvedValue({
      _ID: "10",
      _nombre: "Espada de plata",
      _descripcion: "Espada para monstruos",
      _material: "Acero",
      _peso: "2.5",
      _precio: "no es un número",
      _cantidad: "10",
    });

    ElementoAlmacen.crear((elemento, error) => {
      expect(elemento).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("El precio debe ser un número positivo");
    });
  });

  test("crear() debe lanzar error si se ingresa una cantidad no válida", async () => {
    // Simulamos respuesta inválida
    getPromptMock().mockResolvedValue({
      _ID: "10",
      _nombre: "Espada de plata",
      _descripcion: "Espada para monstruos",
      _material: "Acero",
      _peso: "2.5",
      _precio: "100",
      _cantidad: "no es un número",
    });

    ElementoAlmacen.crear((elemento, error) => {
      expect(elemento).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("La cantidad debe ser un número positivo");
    });
  });
});