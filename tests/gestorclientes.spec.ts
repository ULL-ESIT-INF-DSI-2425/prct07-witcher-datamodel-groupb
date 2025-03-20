import { describe, test, expect } from "vitest";
import GestorClientes from '../src/GestorClientes';
import Cliente from '../src/Cliente';
import exp from "constants";

describe('GestorClientes', () => {
  test('debería crear una instancia de GestorClientes con un array de clientes personalizado', () => {
    const cliente1 = new Cliente(1, 'Geralt de Rivia', 'Humano', 'Kaer Morhen');
    const cliente2 = new Cliente(2, 'Ciri', 'Elfo', 'Vizima');
    const clientesArray:Cliente[] = [cliente1, cliente2];

    const gestorClientes = new GestorClientes(clientesArray);
    expect(gestorClientes).toBeInstanceOf(GestorClientes);

    expect(gestorClientes.length()).toBe(2);
    expect(gestorClientes.getArray()).toEqual(clientesArray);
  });

  test('debería crear una instancia de GestorClientes con un array vacío personalizado', () => {
    const gestorClientes = new GestorClientes([]);
    expect(gestorClientes).toBeInstanceOf(GestorClientes);

    expect(gestorClientes.length()).toBe(0);
    expect(gestorClientes.getArray()).toEqual([]);
  });

  // Pruebas adicionales de la funcionalidad heredada de Gestor

  test('debería agregar un cliente con add() y aumentar el tamaño', () => {
    const gestorClientes = new GestorClientes([]);
    expect(gestorClientes.length()).toBe(0);

    const nuevoCliente = new Cliente(3, 'Yennefer', 'Hechicero', 'Novigrado');
    gestorClientes.add(nuevoCliente);
    expect(gestorClientes.length()).toBe(1);
    expect(gestorClientes.get(3)).toEqual(nuevoCliente);

    expect(gestorClientes.getArray()).toEqual([nuevoCliente]);
  });

  test('debería lanzar error al agregar un cliente con ID duplicado', () => {
    const cliente1 = new Cliente(4, 'Triss', 'Humana', 'Vizima');
    const gestorClientes = new GestorClientes([cliente1]);
    expect(() => gestorClientes.add(cliente1)).toThrow('Error, ID 4 ya está en uso');
  });

  test('debería eliminar un cliente con remove() y disminuir el tamaño', () => {
    const cliente1 = new Cliente(5, 'Dandelion', 'Bardo', 'Novigrado');
    const cliente2 = new Cliente(6, 'Eskel', 'Humano', 'Kaer Morhen');
    const gestorClientes = new GestorClientes([cliente1, cliente2]);

    expect(gestorClientes.length()).toBe(2);
    gestorClientes.remove(5);
    expect(gestorClientes.length()).toBe(1);
    expect(() => gestorClientes.get(5)).toThrow('Bien con ID 5 no encontrado.');
  });

  test('ImprimirTest() debe recorrer todos los clientes e imprimir sus nombres', () => {
    const cliente1 = new Cliente(7, 'Lambert', 'Humano', 'Kaer Morhen');
    const cliente2 = new Cliente(8, 'Eskel', 'Humano', 'Kaer Morhen');
    const gestorClientes = new GestorClientes([cliente1, cliente2]);
  
    // Guardamos la función original de console.log
    const originalLog = console.log;
    // Creamos un array para capturar los mensajes
    const logs: string[] = [];
    // Sobrescribimos console.log para que almacene los mensajes en el array
    console.log = (msg: string) => { logs.push(msg); };
  
    // Llamamos al método que queremos testear
    gestorClientes.ImprimirTest();
  
    // Restauramos la función original
    console.log = originalLog;
  
    // Verificamos que los mensajes esperados se encuentren en el array
    expect(logs).toContain('Lambert');
    expect(logs).toContain('Eskel');
  });
  
});
