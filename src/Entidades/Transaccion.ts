import { D } from "vitest/dist/chunks/reporters.d.CqBhtcTq.js";
import Cliente from "./Cliente.js";
import ElementoAlmacen from "./ElementoAlmacen.js";
import { Entidad } from "./Entidad.js";
import Mercader from "./Mercader.js";
import Bien from "./Bien.js";

/**
 * Interfaz que define la estructura de los detalles de una transacción.
 */
export type DetallesTransaccion = {
  ID: number;
  fecha: Date;
  bienes: ElementoAlmacen;
  persona: Cliente|Mercader;
  devolucion: boolean;
  dinero: number;
};

export default class Transaccion implements Entidad {
  private readonly _dinero: number = 0;

  constructor( 
    private readonly _ID: number,
    private readonly _fecha: Date,
    private readonly _elementosEnTransaccion: ElementoAlmacen,
    private readonly _persona: Cliente | Mercader,
    private readonly _devolucion: boolean = false,
  ) {
    this._dinero = this._elementosEnTransaccion.bien.precio * this._elementosEnTransaccion.cantidad;
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

  static fromJSON(json: any): Transaccion {
    const bienes = ElementoAlmacen.fromJSON(json.bienes);
    const persona = json.persona.raza ? Cliente.fromJSON(json.persona) : Mercader.fromJSON(json.persona);
    return new Transaccion(json.ID, new Date(json.fecha), bienes, persona, json.devolucion);
  }

  /**
   * Función que da un string de la clase
   * @returns Transacción - Transacción creada a partir de un JSON.
   */
  tostring(): string {
    return `Transacción ${this._ID} realizada por ${this._persona.nombre} el ${this._fecha} comprando ${this._elementosEnTransaccion.cantidad} ${this._elementosEnTransaccion.bien.nombre} por un total de ${this._dinero} coronas.`;
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

  get persona() {
    return this._persona;
  }

  get devolucion() {
    return this._devolucion;
  }
}
