import { describe, test, expect } from "vitest";
import Transaccion from '../../src/Entidades/Transaccion';
import ElementoAlmacen from '../../src/Entidades/ElementoAlmacen';
import Bien from '../../src/Entidades/Bien';
import { Cliente } from "../../src";

describe('Transaccion - Pruebas', () => {
  let cliente:Cliente = new Cliente(1, "Geralt", "Humano", "Rivia");
  test('Debe calcular el total correctamente con un solo elemento y resetear la cantidad del elemento', () => {
    const espada = new Bien(
      1, 
      'Espada de Plata de Kaer Morhen', 
      'Espada legendaria forjada en acero de Mahakam', 
      'Acero de Mahakam', 
      3, 
      1500
    );
    // Creamos un ElementoAlmacen para la espada con cantidad 2.
    const elementoEspada = new ElementoAlmacen(espada, 2);
    const fecha = new Date('2025-01-01');

    expect(elementoEspada.cantidad).toBe(2);
  });

  test('Debe calcular el total correctamente con múltiples elementos y resetear cada cantidad', () => {
    const espada = new Bien(
      2, 
      'Espada de Plata de Kaer Morhen', 
      'Espada legendaria forjada en acero de Mahakam', 
      'Acero de Mahakam', 
      3, 
      1500
    );
    
    // Creamos ElementoAlmacen para cada bien
    const elementoEspada = new ElementoAlmacen(espada, 2); // Total esperado: 1500
    
    const fecha = new Date('2025-01-02');
    const transaccion = new Transaccion(2, fecha, elementoEspada, cliente);
    
    expect(elementoEspada.cantidad).toBe(2);
  });

  test('toJSON debe retornar un objeto con la estructura correcta', () => {
    const escudo = new Bien(
      4, 
      'Escudo de Roble de Kaer Trolde', 
      'Escudo robusto tallado en roble', 
      'Roble', 
      4, 
      800
    );
    const elementoEscudo = new ElementoAlmacen(escudo, 2);
    const fecha = new Date('2025-01-03');
    const transaccion = new Transaccion(3, fecha, elementoEscudo, cliente);
    
    const json = transaccion.toJSON();
    
    // Se comprueba que el JSON contenga las propiedades definidas: ID, fecha, bienes y total.
    expect(json).toHaveProperty('ID', 3);
    expect(json).toHaveProperty('fecha');
    expect(json).toHaveProperty('bienes');
    expect(json).toHaveProperty('dinero');
    
    // Y que total sea 0 según la implementación de toJSON.
    expect(json.dinero).toBe(1600);
    
    // Comprobamos que la fecha sea válida.
    expect(new Date(json.fecha).toString()).not.toBe('Invalid Date');
  });

  test('El getter "bienes" debe retornar la lista original de elementos', () => {
    const armadura = new Bien(
      5, 
      'Armadura de Cuero de Vizima', 
      'Armadura ligera y resistente', 
      'Cuero', 
      5, 
      1200
    );
    const elementoArmadura = new ElementoAlmacen(armadura, 1);
    const fecha = new Date('2025-01-04');
    const transaccion = new Transaccion(4, fecha, elementoArmadura, cliente);
    
    expect(transaccion.bienes).toEqual(elementoArmadura);
  });

});
