import { Entidad } from "./Entidad.js";

/**
 * Clase que representa un cazador de monstruos u otro cliente.
 * @param _ID - ID único del cliente
 * @param _nombre - Nombre del cliente (Ejemplo: Geralt de Rivia, Ciri, Yennefer de Vengerberg).
 * @param _raza - Raza del cliente (Ejemplo: Humano, Elfo, Enano, Hechicero).
 * @param _ubicacion - Ubicación actual del cliente (Ejemplo: Kaer Morhen, Vizima, Novigrado).
 * @returns Instancia de la clase Cliente.
 */
export default class Cliente implements Entidad {
  constructor(
    private readonly _ID: number,
    private _nombre: string,
    private _raza: string,
    private _ubicacion: string,
  ) {}

  /**
   * Método que devuelve un JSON con los detalles del cliente.
   * @returns Record\<string, number | string\> - JSON con detalles del cliente.
   */
  toJSON(): Record<string, number | string> {
    return {
      ID: this._ID,
      nombre: this._nombre,
      raza: this._raza,
      ubicacion: this._ubicacion,
    };
  }

  /**
   * Getter de la propiedad ID.
   * @returns ID del cliente.
   */
  get ID() {
    return this._ID;
  }
  /**
   * Getter de la propiedad nombre.
   * @returns Nombre del cliente.
   */
  get nombre() {
    return this._nombre;
  }

  /**
   * Setter de la propiedad nombre.
   * @param nombre - Nombre del cliente.
   */
  set nombre(nombre: string) {
    this._nombre = nombre;
  }

  /**
   * Getter de la propiedad raza.
   * @returns Raza del cliente.
   */
  get raza() {
    return this._raza;
  }

  /**
   * Setter de la propiedad raza.
   * @param raza - Raza del cliente.
   */
  set raza(raza: string) {
    this._raza = raza;
  }

  /**
   * Getter de la propiedad ubicación.
   * @returns Ubicación actual del cliente.
   */
  get ubicacion() {
    return this._ubicacion;
  }

  /**
   * Setter de la propiedad ubicación.
   * @param ubicacion - Ubicación actual del cliente.
   */
  set ubicacion(ubicacion: string) {
    this._ubicacion = ubicacion;
  }
}
