import { describe, test, expect } from "vitest";
import GestorClientes from '../src/GestorClientes';
import Cliente from '../src/Cliente';

describe('GestorClientes', () => {

  test('debería cargar clientes desde JSON al usar el array dummy por defecto', () => {
    const gestorClientes = new GestorClientes();
    expect(gestorClientes).toBeInstanceOf(GestorClientes);

    const almacenMap = (gestorClientes as any)._almacenMap as Map<number, Cliente>;
    expect(almacenMap).toBeInstanceOf(Map);

    const databaseData = (gestorClientes as any).database.data;
    if (databaseData && Array.isArray(databaseData) && databaseData.length > 0) {
      expect(almacenMap.size).toBe(databaseData.length);
      for (const cliente of almacenMap.values()) {
        expect(cliente).toBeInstanceOf(Cliente);
      }
    }
  });

  test('debería crear una instancia de GestorClientes con un array de clientes personalizado', () => {
    const cliente1 = new Cliente(1, 'Geralt de Rivia', 'Humano', 'Kaer Morhen');
    const cliente2 = new Cliente(2, 'Ciri', 'Elfo', 'Vizima');
    const clientesArray = [cliente1, cliente2];

    const gestorClientes = new GestorClientes(clientesArray);
    expect(gestorClientes).toBeInstanceOf(GestorClientes);

    const almacenMap = (gestorClientes as any)._almacenMap as Map<number, Cliente>;
    expect(almacenMap.size).toBe(0);

    const databaseData = (gestorClientes as any).database.data;
    expect(databaseData).toEqual(clientesArray);
  });

  test('debería crear una instancia de GestorClientes con un array vacío personalizado', () => {
    const gestorClientes = new GestorClientes([]);
    expect(gestorClientes).toBeInstanceOf(GestorClientes);

    const almacenMap = (gestorClientes as any)._almacenMap as Map<number, Cliente>;
    expect(almacenMap.size).toBe(0);

    const databaseData = (gestorClientes as any).database.data;
    expect(databaseData).toEqual([]);
  });

  // Pruebas adicionales de la funcionalidad heredada de Gestor

  test('debería agregar un cliente con add() y aumentar el tamaño', () => {
    const gestorClientes = new GestorClientes([]);
    expect(gestorClientes.length()).toBe(0);
    const nuevoCliente = new Cliente(3, 'Yennefer', 'Hechicero', 'Novigrado');
    gestorClientes.add(nuevoCliente);
    expect(gestorClientes.length()).toBe(1);
    expect(gestorClientes.get(3)).toEqual(nuevoCliente);

    const databaseData = (gestorClientes as any).database.data;
    expect(databaseData).toEqual([nuevoCliente]);
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

    const databaseData = (gestorClientes as any).database.data;
    // Se espera que database.data ya no incluya cliente1
    expect(databaseData.find((c: Cliente) => c.ID === 5)).toBeUndefined();
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
