import { describe, test, expect, afterEach } from "vitest";
import GestorMercaderes from '../src/Gestores/GestorMercaderes';
import Mercader from '../src/Entidades/Mercader';

describe('GestorMercaderes', () => {

  afterEach(() => {
      GestorMercaderes.resetInstance();
    });
  

  test('debería crear una instancia de GestorMercaderes con un array de mercaderes personalizado', () => {
    const mercader1 = new Mercader(1, 'Hattori', 'Herrero', 'Novigrado');
    const mercader2 = new Mercader(2, 'Fergus Graem', 'Mercader General', 'Velen');
    const mercaderesArray = [mercader1, mercader2];

    const gestorMercaderes = GestorMercaderes.getGestorInstancia(mercaderesArray);
    expect(gestorMercaderes).toBeInstanceOf(GestorMercaderes);

    expect(gestorMercaderes.length()).toBe(2);

    expect(gestorMercaderes.getArray()).toEqual(mercaderesArray);
  });

  test('debería crear una instancia de GestorMercaderes con un array vacío personalizado', () => {
    const gestorMercaderes = GestorMercaderes.getGestorInstancia([]);
    expect(gestorMercaderes).toBeInstanceOf(GestorMercaderes);

    expect(gestorMercaderes.length()).toBe(0);

    expect(gestorMercaderes.getArray()).toEqual([]);
  });

  // Pruebas adicionales de la funcionalidad heredada de Gestor

  test('debería agregar un mercader con add() y aumentar el tamaño', () => {
    const gestorMercaderes = GestorMercaderes.getGestorInstancia([]);
    expect(gestorMercaderes.length()).toBe(0);
    const nuevoMercader = new Mercader(3, 'Mercader X', 'Mercader General', 'Velen');
    gestorMercaderes.add(nuevoMercader);
    expect(gestorMercaderes.length()).toBe(1);
    expect(gestorMercaderes.get(3)).toEqual(nuevoMercader);

    expect(gestorMercaderes.getArray()).toEqual([nuevoMercader]);
  });

  test('debería lanzar error al agregar un mercader con ID duplicado', () => {
    const mercader1 = new Mercader(4, 'Mercader Y', 'Herrero', 'Novigrado');
    const gestorMercaderes = GestorMercaderes.getGestorInstancia([mercader1]);
    expect(() => gestorMercaderes.add(mercader1)).toThrow('Error, ID 4 ya está en uso');
  });

  test('debería eliminar un mercader con remove() y disminuir el tamaño', () => {
    const mercader1 = new Mercader(5, 'Mercader Z', 'Alquimista', 'Velen');
    const mercader2 = new Mercader(6, 'Mercader W', 'Herrero', 'Novigrado');
    const gestorMercaderes = GestorMercaderes.getGestorInstancia([mercader1, mercader2]);
    expect(gestorMercaderes.length()).toBe(2);
    gestorMercaderes.remove(5);
    expect(gestorMercaderes.length()).toBe(1);
    expect(() => gestorMercaderes.get(5)).toThrow('Bien con ID 5 no encontrado.');
  });

  test('ImprimirTest() debe recorrer todos los mercaderes e imprimir sus nombres', () => {
    const mercader1 = new Mercader(7, 'Hattori', 'Herrero', 'Novigrado');
    const mercader2 = new Mercader(8, 'Fergus Graem', 'Mercader General', 'Velen');
    const gestorMercaderes = GestorMercaderes.getGestorInstancia([mercader1, mercader2]);

    // Guardamos la función original de console.log
    const originalLog = console.log;
    // Creamos un array para capturar los mensajes
    const logs: string[] = [];
    // Sobrescribimos console.log para capturar los mensajes en el array
    console.log = (msg: string) => { logs.push(msg); };

    // Ejecutamos el método que queremos testear
    gestorMercaderes.ImprimirTest();

    // Restauramos la función original
    console.log = originalLog;

    // Verificamos que se hayan impreso los nombres esperados
    expect(logs).toContain('Hattori');
    expect(logs).toContain('Fergus Graem');
  });
});
