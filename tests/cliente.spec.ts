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

  test('debería permitir modificar el nombre', () => {
    const cliente = new Cliente(2, 'Ciri', 'Elfo', 'Vizima');
    cliente.nombre = 'Cirilla Fiona';
    expect(cliente.nombre).toBe('Cirilla Fiona');
  });

  test('debería permitir modificar la raza', () => {
    const cliente = new Cliente(3, 'Yennefer', 'Humana', 'Novigrado');
    cliente.raza = 'Hechicero';
    expect(cliente.raza).toBe('Hechicero');
  });

  test('debería permitir modificar la ubicación', () => {
    const cliente = new Cliente(4, 'Triss Merigold', 'Humana', 'Vizima');
    cliente.ubicacion = 'Novigrado';
    expect(cliente.ubicacion).toBe('Novigrado');
  });

  test('debería no permitir modificar el ID una vez creado', () => {
    const cliente = new Cliente(5, 'Lambert', 'Humano', 'Kaer Morhen');
    // Se intenta modificar el _ID de forma forzada; se espera que el ID original se mantenga.
    try {
      (cliente as any)._ID = 999;
    } catch (e) {
      // Se ignora el error.
    }
    expect(cliente.ID).toBe(5);
  });

  test('debería crear múltiples instancias de Cliente y mantener sus propiedades de forma independiente', () => {
    const cliente1 = new Cliente(6, 'Eskel', 'Humano', 'Kaer Morhen');
    const cliente2 = new Cliente(7, 'Lambert', 'Humano', 'Kaer Morhen');
    cliente1.nombre = 'Eskel Actualizado';
    cliente2.ubicacion = 'Vizima';
    expect(cliente1.nombre).toBe('Eskel Actualizado');
    expect(cliente2.ubicacion).toBe('Vizima');
    expect(cliente1.ID).not.toBe(cliente2.ID);
  });

  test('debería permitir modificar secuencialmente nombre, raza y ubicación', () => {
    const cliente = new Cliente(8, 'Dandelion', 'Humano', 'Novigrado');
    cliente.nombre = 'Dandelion el Bardo';
    expect(cliente.nombre).toBe('Dandelion el Bardo');
    cliente.raza = 'Bardo';
    expect(cliente.raza).toBe('Bardo');
    cliente.ubicacion = 'Vizima';
    expect(cliente.ubicacion).toBe('Vizima');
  });

  test('debería permitir asignar cadenas vacías o con espacios a nombre, raza y ubicación', () => {
    const cliente = new Cliente(9, 'Original', 'Original', 'Original');
    cliente.nombre = '';
    cliente.raza = '   ';
    cliente.ubicacion = '';
    expect(cliente.nombre).toBe('');
    expect(cliente.raza).toBe('   ');
    expect(cliente.ubicacion).toBe('');
  });

  test('debería permitir asignar caracteres especiales a las propiedades', () => {
    const cliente = new Cliente(10, 'Cliente', 'Raza', 'Ubicación');
    cliente.nombre = '@#$%^&*()';
    cliente.raza = 'Elfo-ñ';
    cliente.ubicacion = 'Ciudad: *&%$#@!';
    expect(cliente.nombre).toBe('@#$%^&*()');
    expect(cliente.raza).toBe('Elfo-ñ');
    expect(cliente.ubicacion).toBe('Ciudad: *&%$#@!');
  });

});

