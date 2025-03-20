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

  test('debería permitir modificar el nombre', () => {
    const bien = new Bien(2, 'Armadura', 'Armadura medieval', 'Cuero endurecido', 5, 800, 5);
    bien.nombre = 'Armadura reforzada';
    expect(bien.nombre).toBe('Armadura reforzada');
  });

  test('debería permitir modificar la descripción', () => {
    const bien = new Bien(3, 'Escudo', 'Escudo resistente', 'Madera y metal', 3, 500, 7);
    bien.descripcion = 'Escudo legendario';
    expect(bien.descripcion).toBe('Escudo legendario');
  });

  test('debería permitir modificar el material', () => {
    const bien = new Bien(4, 'Casco', 'Casco de batalla', 'Hierro', 1.5, 300, 12);
    bien.material = 'Acero';
    expect(bien.material).toBe('Acero');
  });

  test('debería permitir modificar el peso con valor válido (> 0)', () => {
    const bien = new Bien(5, 'Arco', 'Arco largo', 'Madera de tejo', 1, 600, 4);
    bien.peso = 1.2;
    expect(bien.peso).toBe(1.2);
  });

  test('debería lanzar error al asignar un peso menor o igual a 0', () => {
    const bien = new Bien(6, 'Báculo', 'Báculo místico', 'Madera sagrada', 2, 1000, 3);
    expect(() => {
      bien.peso = 0;
    }).toThrow("El peso debe ser un valor positivo.");
    expect(() => {
      bien.peso = -1;
    }).toThrow("El peso debe ser un valor positivo.");
  });

  test('debería permitir modificar el precio con valor mayor o igual a 0', () => {
    const bien = new Bien(7, 'Capa', 'Capa de invisibilidad', 'Tela mágica', 0.5, 2000, 2);
    bien.precio = 1800;
    expect(bien.precio).toBe(1800);
    bien.precio = 0;
    expect(bien.precio).toBe(0);
  });

  test('debería lanzar error al asignar un precio negativo', () => {
    const bien = new Bien(8, 'Anillo', 'Anillo encantado', 'Oro', 0.1, 5000, 1);
    expect(() => {
      bien.precio = -100;
    }).toThrow("El precio no puede ser negativo.");
  });

  test('debería permitir modificar la cantidad con valor entero no negativo', () => {
    const bien = new Bien(9, 'Poción', 'Poción curativa', 'Vidrio', 0.3, 50, 20);
    bien.cantidad = 15;
    expect(bien.cantidad).toBe(15);
    bien.cantidad = 0;
    expect(bien.cantidad).toBe(0);
  });

  test('debería lanzar error al asignar una cantidad negativa o no entera', () => {
    const bien = new Bien(10, 'Elixir', 'Elixir de vida', 'Cristal', 0.2, 300, 5);
    expect(() => {
      bien.cantidad = -3;
    }).toThrow("La cantidad debe ser un número entero no negativo.");
    expect(() => {
      bien.cantidad = 2.5;
    }).toThrow("La cantidad debe ser un número entero no negativo.");
  });

});
