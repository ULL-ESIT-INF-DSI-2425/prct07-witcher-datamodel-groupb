import { D } from "vitest/dist/chunks/reporters.d.CqBhtcTq.js";
import Cliente from "./Cliente.js";
import ElementoAlmacen from "./ElementoAlmacen.js";
import { Entidad } from "./Entidad.js";
import Mercader from "./Mercader.js";

/**
 * Interfaz que define la estructura de los detalles de una transacción.
 */
export type DetallesTransaccion = {
  ID: number;
  fecha: Date;
  bienes: ElementoAlmacen[];
  persona: Cliente|Mercader;
  devolucion: boolean;
  dinero: number;
};

export default class Transaccion implements Entidad {
  private readonly _dinero: number = 0;

  constructor( 
    private readonly _ID: number,
    private readonly _fecha: Date,
    private readonly _elementosEnTransaccion: ElementoAlmacen[],
    private readonly _persona: Cliente | Mercader,
    private readonly _devolucion: boolean = false,
  ) {
    this._dinero = this.CalcularTotalVentas();
  }

  /**
   * Método que devuelve un JSON con los detalles de la transacción.
   * @returns DetallesTransaccion - JSON con detalles de la transacción.
   */
  toJSON(): DetallesTransaccion {
    return {
      ID: this._ID,
      fecha: this._fecha,
      bienes: this._elementosEnTransaccion,
      persona: this._persona,
      devolucion: this._devolucion,
      dinero: this._dinero,
    }
  }

  /**
   * Getter de la propiedad ID.
   * @returns ID del mercader.
   */
  get ID() {
    return this._ID;
  }

  /**
   * Getter de la propiedad fecha.
   * @returns Fecha de la transacción.
   */
  get fecha() {
    return this._fecha;
  }
  get bienes() {
    return this._elementosEnTransaccion;
  }

  /**
   * Ventas realizadas a clientes. Se calcula el total de coronas.
   * @returns number - Total de ventas en coronas.
   */
  private CalcularTotalVentas(): number {
    let total = 0;
    for (const elementoTransaccion of this._elementosEnTransaccion) {
      total += elementoTransaccion.bien.precio * elementoTransaccion.cantidad;
      // Quitar el bien del inventario (cantidad)
      elementoTransaccion.cantidad -= elementoTransaccion.cantidad;
    }
    return total;
  }

  /**
   * Compras realizadas a mercaderes. Se calcula el total de coronas.
   * @returns number - Total de compras en coronas.
   */
  private CalcularTotalCompras(): number {
    let total = 0;
    for (const elementoTransaccion of this._elementosEnTransaccion) {
      // Comprobar que seguimos teniendo efectivo
      if (
        elementoTransaccion.bien.precio * elementoTransaccion.cantidad >
        total
      ) {
        console.log("No hay suficiente efectivo para realizar la compra");
        return 0;
      } else {
        // Se quita el dinero de la compra
        total -= elementoTransaccion.bien.precio * elementoTransaccion.cantidad;
        // Añadir el bien al inventario (cantidad)
        elementoTransaccion.cantidad += elementoTransaccion.cantidad;
      }
    }
    return total;
  }
  
}
