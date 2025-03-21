import { ElementoAlmacen } from "../Gestores/Inventario.js";
import { Entidad } from "./Entidad.js";

export type DetallesTransaccion = {
  ID: number;
  fecha: Date;
  bienes: ElementoAlmacen[];
  total: number;
};

export default class Transaccion implements Entidad {
  private _total: number;

  constructor(
    private readonly _ID: number,
    private _fecha: Date,
    private _elementosEnTransaccion: ElementoAlmacen[],
  ) {
    this._total = this.CalcularTotalCoronas();
  }

  toJSON(): DetallesTransaccion {
    return {
      ID: this._ID,
      fecha: new Date(),
      bienes: [],
      total: 0,
    };
  }

  /**
   * Getter de la propiedad ID.
   * @returns ID del mercader.
   */
  get ID() {
    return this._ID;
  }

  get fecha() {
    return this._fecha;
  }
  get bienes() {
    return this._elementosEnTransaccion;
  }

  /**
   * Ventas
   * @returns
   */
  private CalcularTotalCoronas(): number {
    let total = 0;
    for (const elementoTransaccion of this._elementosEnTransaccion) {
      total += elementoTransaccion.bien.precio * elementoTransaccion.cantidad;
    }
    return total;
  }
}
