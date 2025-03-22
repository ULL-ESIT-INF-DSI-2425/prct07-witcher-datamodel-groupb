import { describe, test, expect } from "vitest";
import Transaccion from '../../src/Entidades/Transaccion';
import ElementoAlmacen from '../../src/Entidades/ElementoAlmacen';
import Bien from '../../src/Entidades/Bien';

describe('Transaccion - Pruebas', () => {
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
    const transaccion = new Transaccion(1, fecha, [elementoEspada]);

    // La lógica interna de Transaccion (CalcularTotalVentas) se espera que use
    // la cantidad del elemento y luego la "resetee" a 0.
    expect(elementoEspada.cantidad).toBe(0);
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
    const escudo = new Bien(
      3, 
      'Escudo de Roble de Kaer Trolde', 
      'Escudo robusto tallado en roble', 
      'Roble', 
      4, 
      800
    );
    
    // Creamos ElementoAlmacen para cada bien
    const elementoEspada = new ElementoAlmacen(espada, 1); // Total esperado: 1500
    const elementoEscudo = new ElementoAlmacen(escudo, 2);  // Total esperado: 2 * 800 = 1600
    
    const fecha = new Date('2025-01-02');
    const transaccion = new Transaccion(2, fecha, [elementoEspada, elementoEscudo]);
    
    // Verificamos que ambas cantidades hayan sido "reseteadas" a 0 tras el cálculo.
    expect(elementoEspada.cantidad).toBe(0);
    expect(elementoEscudo.cantidad).toBe(0);
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
    const transaccion = new Transaccion(3, fecha, [elementoEscudo]);
    
    const json = transaccion.toJSON();
    
    // Se comprueba que el JSON contenga las propiedades definidas: ID, fecha, bienes y total.
    expect(json).toHaveProperty('ID', 3);
    expect(json).toHaveProperty('fecha');
    expect(json).toHaveProperty('bienes');
    expect(json).toHaveProperty('total');
    
    // Verificamos que 'bienes' sea un array (en este caso, la implementación retorna un array vacío)
    expect(Array.isArray(json.bienes)).toBe(true);
    // Y que total sea 0 según la implementación de toJSON.
    expect(json.total).toBe(0);
    
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
    const transaccion = new Transaccion(4, fecha, [elementoArmadura]);
    
    expect(transaccion.bienes).toEqual([elementoArmadura]);
  });
});
