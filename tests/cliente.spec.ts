import { describe, test, expect } from 'vitest';
import { Cliente } from '../src/Cliente';

describe('Cliente', () => {
  test('Los getters deben devolver los valores asignados', () => {
    const cliente = new Cliente(201, 'Aragorn', 'Humano', 'Rohan');
    expect(cliente.getId()).toBe(201);
    expect(cliente.getNombre()).toBe('Aragorn');
    expect(cliente.getRaza()).toBe('Humano');
    expect(cliente.getUbicacion()).toBe('Rohan');
  });

  test('El setter modifica el nombre correctamente', () => {
    const cliente = new Cliente(202, 'Legolas', 'Elfo', 'Mirkwood');
    cliente.setNombre('Legolas Greenleaf');
    expect(cliente.getNombre()).toBe('Legolas Greenleaf');
  });
});
