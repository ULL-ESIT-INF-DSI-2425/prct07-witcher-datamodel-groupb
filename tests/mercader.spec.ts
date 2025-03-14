import { describe, test, expect } from 'vitest';
import { Mercader } from '../src/Mercader';

describe('Mercader', () => {
  test('Los getters deben devolver los valores asignados', () => {
    const mercader = new Mercader(101, 'Hattori', 'Herrero', 'Novigrado');
    expect(mercader.getId()).toBe(101);
    expect(mercader.getNombre()).toBe('Hattori');
    expect(mercader.getTipo()).toBe('Herrero');
    expect(mercader.getUbicacion()).toBe('Novigrado');
  });

  test('El setter modifica el nombre correctamente', () => {
    const mercader = new Mercader(102, 'Fergus', 'Alquimista', 'Velen');
    mercader.setNombre('Fergus Graem');
    expect(mercader.getNombre()).toBe('Fergus Graem');
  });
});
