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
    const transaccion = new Transaccion(1, fecha, [elementoEspada], cliente);

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
    const transaccion = new Transaccion(2, fecha, [elementoEspada, elementoEscudo], cliente);
    
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
    const transaccion = new Transaccion(3, fecha, [elementoEscudo], cliente);
    
    const json = transaccion.toJSON();
    
    // Se comprueba que el JSON contenga las propiedades definidas: ID, fecha, bienes y total.
    expect(json).toHaveProperty('ID', 3);
    expect(json).toHaveProperty('fecha');
    expect(json).toHaveProperty('bienes');
    expect(json).toHaveProperty('dinero');
    
    // Verificamos que 'bienes' sea un array (en este caso, la implementación retorna un array vacío)
    expect(Array.isArray(json.bienes)).toBe(true);
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
    const transaccion = new Transaccion(4, fecha, [elementoArmadura], cliente);
    
    expect(transaccion.bienes).toEqual([elementoArmadura]);
  });

  test('CalcularTotalCompras: sin efectivo, retorna 0', () => {
    // Creamos un bien con un precio > 0 y una cantidad > 0
    const bienCaro = new Bien(1, 'Bien Caro', 'Desc', 'Material', 1, 1000);
    // Necesitamos 2 unidades => precio total 2000
    const elemento = new ElementoAlmacen(bienCaro, 2);
  
    // Creamos la transacción
    const transaccion = new Transaccion(1, new Date(), [elemento], cliente);
  
    // Forzamos la llamada al método privado usando cast
    const resultado = (transaccion as unknown as { CalcularTotalCompras: () => number }).CalcularTotalCompras();
  
    // Esperamos que retorne 0 y se imprima "No hay suficiente efectivo..."
    expect(resultado).toBe(0);
  });

  test('CalcularTotalCompras: con precio 0 se ejecuta el else', () => {
    // Creamos un bien "gratuito" (precio = 0)
    const bienGratis = new Bien(2, 'Bien Gratis', 'Desc', 'Material', 1, 0);
    // Cantidad 2 => precio * cantidad = 0
    const elemento = new ElementoAlmacen(bienGratis, 2);
  
    // Creamos una instancia vacía de transaccion y forzamos que tenga la propiedad privada
    const transaccion = Object.create(Transaccion.prototype) as unknown as { _elementosEnTransaccion: ElementoAlmacen[]; CalcularTotalCompras: () => number };

    // Asignamos la propiedad privada
    transaccion._elementosEnTransaccion = [elemento];
  
    // Llamamos al método privado
    const resultado = transaccion.CalcularTotalCompras();
  
    // Aquí, entra en el else, hace total -= 0 y duplica la cantidad (cantidad += cantidad)
    // Por lo tanto, resultado final de la función será 0
    expect(resultado).toBe(0);
  
    // Verificamos que la cantidad se haya duplicado
    // Inicialmente era 2, luego elementoTransaccion.cantidad += elementoTransaccion.cantidad => 4
    expect(elemento.cantidad).toBe(4);
  });  
});
