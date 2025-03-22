import { describe, test, expect, afterEach } from "vitest";
import Inventario from "../../src/Gestores/Inventario";
import Bien from "../../src/Entidades/Bien";
import { ElementoAlmacen } from "../../src/Entidades/ElementoAlmacen";
//import { Transaccion, TipoTransaccion } from "./Transaccion";

describe("Constructor Inventario", () => {
  afterEach(() => {
    Inventario.resetInstance();
  });

  test("Debe añadir y eliminar bienes correctamente", () => {
    const inventario = Inventario.getGestorInstancia([]);

    // Agregamos un bien.
    const bien = new Bien(
      1,
      "Espada de Acero",
      "Espada forjada en acero",
      "Acero",
      3.5,
      100,
    );

    const elemento = new ElementoAlmacen(bien, 1);
    inventario.add(elemento);


    expect(inventario.length()).toBe(1);
    expect(inventario.get(1).bien.nombre).toBe("Espada de Acero");

    // Eliminamos el bien por su ID.
    inventario.remove(1);
    expect(inventario.length()).toBe(0);
  });

  test("debería que cada elemento cargado en _almacenMap sea una instancia de EnlementosAlmacen", () => {
    const inventario = Inventario.getGestorInstancia();
    for (const bien of inventario.almacenMap.values()) {
      expect(bien).toBeInstanceOf(ElementoAlmacen);
    }
  });

  test("debería crear una instancia de Inventario con un array de bienes personalizado", () => {
    const bien1 = new Bien(
      3,
      "Espada",
      "Espada legendaria",
      "Acero",
      2,
      1500,
    );
    const bien2 = new Bien(4, "Escudo", "Escudo robusto", "Madera", 3, 800);

    const elementosArray:ElementoAlmacen[] = [new ElementoAlmacen(bien1, 10), new ElementoAlmacen(bien2, 5)];

    const inventario = Inventario.getGestorInstancia(elementosArray);
    expect(inventario).toBeInstanceOf(Inventario);

    expect(inventario.length()).toBe(2);

    expect(inventario.getArray()).toEqual(elementosArray);
  });

  test("debería crear una instancia de Inventario con un array vacío personalizado", () => {
    // Probar la rama else pasando un array vacío
    const inventario = Inventario.getGestorInstancia([]);
    expect(inventario).toBeInstanceOf(Inventario);

    // Al no haber bienes, _almacenMap debe quedar vacío
    expect(inventario.length()).toBe(0);
    expect(inventario.getArray()).toEqual([]);
  });

  /** 
  test("Debe calcular el stock correctamente a partir de transacciones", () =\> \{
    const inventario = new Inventario([], [], [], []);

    // Simulamos transacciones para el bien con ID 1:
    // Compra de 10 unidades.
    const compra = new Transaccion(
      new Date(),
      [\{ idBien: 1, cantidad: 10 \}],
      500,
      TipoTransaccion.Compra,
      100,
    );
    // Venta de 3 unidades.
    const venta = new Transaccion(
      new Date(),
      [\{ idBien: 1, cantidad: 3 \}],
      150,
      TipoTransaccion.Venta,
      200,
    );

    inventario.addTransaccion(compra);
    inventario.addTransaccion(venta);

    const stock = inventario.getStock(1);
    expect(stock).toBe(7);
  \});
  */
});
