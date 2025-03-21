import { describe, test, expect } from "vitest";
//import { Transaccion, TipoTransaccion } from "../src/Transaccion";

describe("Transaccion", () => {
  test("Tests vacios para poder ejecutar el resto", () => {});
  /**
  test("Los getters deben devolver los valores asignados", () => {
    const bienes = [
      { bienId: 1, cantidad: 5 },
      { bienId: 2, cantidad: 3 },
    ];
    const fecha = new Date("2023-04-01");
    const transaccion = new Transaccion(
      fecha,
      bienes,
      500,
      TipoTransaccion.Compra,
      100,
    );

    expect(transaccion.getFecha().toISOString()).toBe(fecha.toISOString());
    expect(transaccion.getBienes()).toEqual(bienes);
    expect(transaccion.getCantidad()).toBe(500);
    expect(transaccion.getTipo()).toBe(TipoTransaccion.Compra);
    expect(transaccion.getClienteId()).toBe(100);
  });
   */
});
