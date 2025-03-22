import { describe, test, expect, beforeEach, vi } from "vitest";
import inquirer from "inquirer";
import GestorTransacciones from '../../src/Gestores/GestorTransacciones';
import Transaccion from '../../src/Entidades/Transaccion';
import Bien from '../../src/Entidades/Bien';
import ElementoAlmacen from '../../src/Entidades/ElementoAlmacen';

describe('GestorTransacciones - Pruebas', () => {
  // Reseteamos la instancia del singleton antes de cada prueba.
  beforeEach(() => {
    GestorTransacciones.resetInstance();
  });

  test('getGestorInstancia debe retornar una instancia y seguir el patrón singleton', () => {
    const gestor1 = GestorTransacciones.getGestorInstancia();
    const gestor2 = GestorTransacciones.getGestorInstancia();
    expect(gestor1).toBe(gestor2);
  });

  test('resetInstance debe permitir crear una nueva instancia', () => {
    const gestor1 = GestorTransacciones.getGestorInstancia();
    GestorTransacciones.resetInstance();
    const gestor2 = GestorTransacciones.getGestorInstancia();
    expect(gestor1).not.toBe(gestor2);
  });

  test('Debe agregar transacciones correctamente y aumentar el tamaño', () => {
    const espada = new Bien(
      1,
      'Espada de Plata de Kaer Morhen',
      'Espada legendaria forjada en acero de Mahakam',
      'Acero de Mahakam',
      3,
      1500
    );
    const elementoEspada = new ElementoAlmacen(espada, 2);
    const transaccion1 = new Transaccion(10, new Date('2025-01-10'), [elementoEspada]);
    
    // Forzamos la rama "else" pasando un array personalizado.
    const gestor = GestorTransacciones.getGestorInstancia([transaccion1]);
    expect(gestor.length()).toBe(1);
    
    const escudo = new Bien(
      2,
      'Escudo de Roble de Kaer Trolde',
      'Escudo robusto tallado en roble',
      'Roble',
      4,
      800
    );
    const elementoEscudo = new ElementoAlmacen(escudo, 1);
    const transaccion2 = new Transaccion(11, new Date('2025-01-11'), [elementoEscudo]);
    gestor.add(transaccion2);
    expect(gestor.length()).toBe(2);
    expect(gestor.get(11)).toEqual(transaccion2);
  });

  test('Debe lanzar error al agregar una transacción con ID duplicado', () => {
    const espada = new Bien(
      3,
      'Espada de Plata de Kaer Morhen',
      'Espada legendaria',
      'Acero de Mahakam',
      3,
      1500
    );
    const elementoEspada = new ElementoAlmacen(espada, 2);
    const transaccion = new Transaccion(20, new Date('2025-01-12'), [elementoEspada]);
    const gestor = GestorTransacciones.getGestorInstancia([transaccion]);
    expect(() => gestor.add(transaccion)).toThrow('Error, ID 20 ya está en uso');
  });

  test('Debe eliminar una transacción y disminuir el tamaño', () => {
    const escudo = new Bien(
      4,
      'Escudo de Roble de Kaer Trolde',
      'Escudo robusto',
      'Roble',
      4,
      800
    );
    const elementoEscudo = new ElementoAlmacen(escudo, 1);
    const transaccion = new Transaccion(30, new Date('2025-01-13'), [elementoEscudo]);
    const gestor = GestorTransacciones.getGestorInstancia([transaccion]);
    expect(gestor.length()).toBe(1);
    
    gestor.remove(30);
    expect(gestor.length()).toBe(0);
    expect(() => gestor.get(30)).toThrow();
  });

  test('storeInventario debe reflejar los cambios en database.data', () => {
    const armadura = new Bien(
      5,
      'Armadura de Cuero de Vizima',
      'Armadura ligera y resistente',
      'Cuero',
      5,
      1200
    );
    const elementoArmadura = new ElementoAlmacen(armadura, 1);
    const transaccion = new Transaccion(40, new Date('2025-01-14'), [elementoArmadura]);
    const gestor = GestorTransacciones.getGestorInstancia([transaccion]);
    
    const datos = (gestor as any).database.data;
    expect(datos).toEqual(expect.arrayContaining([transaccion]));
  });

  test('El método get debe lanzar error al solicitar un ID inexistente', () => {
    const escudo = new Bien(
      6,
      'Escudo de Roble de Kaer Trolde',
      'Escudo robusto',
      'Roble',
      4,
      800
    );
    const elementoEscudo = new ElementoAlmacen(escudo, 1);
    const transaccion = new Transaccion(50, new Date('2025-01-15'), [elementoEscudo]);
    const gestor = GestorTransacciones.getGestorInstancia([transaccion]);
    expect(() => gestor.get(999)).toThrow('Bien con ID 999 no encontrado.');
  });

  test('ImprimirTest debe recorrer las transacciones e imprimir sus IDs y nombres de bienes', () => {
    const espada = new Bien(
      7,
      'Espada de Plata de Kaer Morhen',
      'Espada legendaria forjada en acero de Mahakam',
      'Acero de Mahakam',
      3,
      1500
    );
    const escudo = new Bien(
      8,
      'Escudo de Roble de Kaer Trolde',
      'Escudo robusto tallado en roble',
      'Roble',
      4,
      800
    );
    const elementoEspada = new ElementoAlmacen(espada, 2);
    const elementoEscudo = new ElementoAlmacen(escudo, 1);
    const transaccion1 = new Transaccion(60, new Date('2025-01-16'), [elementoEspada]);
    const transaccion2 = new Transaccion(61, new Date('2025-01-17'), [elementoEscudo]);
    const gestor = GestorTransacciones.getGestorInstancia([transaccion1, transaccion2]);

    // Para capturar la salida, sobrescribimos console.log manualmente.
    const originalLog = console.log;
    const logs: string[] = [];
    console.log = (msg: unknown) => { logs.push(String(msg)); };

    gestor.ImprimirTest();

    console.log = originalLog;
    // Se espera que se impriman los IDs "60" y "61" y los nombres reales de los bienes.
    expect(logs).toContain('60');
    expect(logs).toContain('61');
  });

  test('Constructor - else branch: cargar desde Dummytransacciones.json', () => {
    // Usamos un array vacio para forzar la rama del else
    const gestor = GestorTransacciones.getGestorInstancia([]);

    // Comprobamos que el gestor se crea correctamente
    expect(gestor).toBeInstanceOf(GestorTransacciones);
  });
});

// Mock crea una versión "falsa" de una funcion para verificar interacciones
// Como se importa inquirer por defecto, el mock debe incluir la propiedad "default".
vi.mock('inquirer', () => {
  return {
    default: { prompt: vi.fn(), },
  };
});  

describe('GestorTransacciones - Método crear()', () => {
beforeEach(() => {
  GestorTransacciones.resetInstance();
});

test('crear() con ID válido agrega una transacción', async () => {
  // Simulamos que el usuario introduce "10" como ID
  (inquirer.prompt as unknown as { mockResolvedValue: (val: unknown) => void }).mockResolvedValue({ _ID: '10' });

  const gestor = GestorTransacciones.getGestorInstancia([]);
  // Llamamos al método crear(), que hace inquirer.prompt(...)
  gestor.crear();

  // El método crear() retorna una promesa (por el .then). Esperamos a que se resuelva:
  await new Promise(process.nextTick);

  // Verificamos que la transacción con ID 10 se haya agregado
  const tx = gestor.get(10);
  expect(tx).toBeInstanceOf(Transaccion);
  expect(tx.ID).toBe(10);
});

test('crear() con ID duplicado muestra error', async () => {
  // Simulamos que el usuario introduce "10" como ID
  (inquirer.prompt as unknown as { mockResolvedValue: (val: unknown) => void }).mockResolvedValue({ _ID: '10' });

  const gestor = GestorTransacciones.getGestorInstancia([]);
  // Agregamos una transacción con ID 10 antes
  gestor.add(new Transaccion(10, new Date(), []));

  // Sobrescribimos console.error para capturar el mensaje
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  gestor.crear();
  await new Promise(process.nextTick);

  // Verificamos que se llamó a console.error con el mensaje de error
  expect(consoleSpy).toHaveBeenCalledWith('Error, ID 10 ya está en uso');

  consoleSpy.mockRestore();
});
});
