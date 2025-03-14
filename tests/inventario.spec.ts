import { describe, test, expect } from "vitest";
import { Inventario } from "./Inventario";
import { Bien } from "./Bien";
import { Transaccion, TipoTransaccion } from "./Transaccion";

describe("Constructor Inventario", () => {
  test("Debe añadir y eliminar bienes correctamente", () => {
    const inventario = new Inventario([], [], [], []);

    // Agregamos un bien.
    const bien = new Bien(
      1,
      "Espada de Acero",
      "Espada forjada en acero",
      "Acero",
      3.5,
      100,
    );
    inventario.addBien(bien);

    expect(inventario.getBienes().length).toBe(1);
    expect(inventario.getBienes()[0].getNombre()).toBe("Espada de Acero");

    // Eliminamos el bien por su ID.
    inventario.removeBien(1);
    expect(inventario.getBienes().length).toBe(0);
  });

  test("Debe calcular el stock correctamente a partir de transacciones", () => {
    const inventario = new Inventario([], [], [], []);

    // Simulamos transacciones para el bien con ID 1:
    // Compra de 10 unidades.
    const compra = new Transaccion(
      new Date(),
      [{ idBien: 1, cantidad: 10 }],
      500,
      TipoTransaccion.Compra,
      100,
    );
    // Venta de 3 unidades.
    const venta = new Transaccion(
      new Date(),
      [{ idBien: 1, cantidad: 3 }],
      150,
      TipoTransaccion.Venta,
      200,
    );

    inventario.addTransaccion(compra);
    inventario.addTransaccion(venta);

    const stock = inventario.getStock(1);
    expect(stock).toBe(7);
  });
});
