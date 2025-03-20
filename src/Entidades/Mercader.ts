import { Entidad } from "./Entidad.js";

/**
 * Clase que representa un mercader.
 * @param _ID - ID único del mercader
 * @param _nombre - Nombre del mercader (Ejemplo: Hattori, Fergus Graem).
 * @param _tipo - Tipo de mercader (Ejemplo: Herrero, Alquimista, Mercader General).
 * @param _ubicacion - Ubicación del mercader (Ejemplo: Novigrado, Velen, Kaer Trolde).
 * @returns Instancia de la clase Mercader.
 */
export default class Mercader implements Entidad{
  constructor(
    private readonly _ID: number,
    private _nombre: string,
    private _tipo: string,
    private _ubicacion: string,
  ) {}

  toJSON(): Record<string, number|string> {
    return {
      ID: this._ID,
      nombre: this._nombre,
      tipo: this._tipo,
      ubicacion: this._ubicacion,
    };
  }
  
  /**
   * Getter de la propiedad ID.
   * @returns ID del mercader.
   */
  get ID() {
    return this._ID;
  }
  /**
   * Getter de la propiedad nombre.
   * @returns Nombre del mercader.
   */
  get nombre() {
    return this._nombre;
  }

  set nombre(nombre:string){
    this._nombre = nombre;
  }

  /**
   * Getter de la propiedad tipo.
   * @returns Tipo de mercader.
   */
  get tipo() {
    return this._tipo;
  }

  set tipo(tipo:string){
    this._tipo = tipo;
  }

  /**
   * Getter de la propiedad ubicación.
   * @returns Ubicación del mercader.
   */
  get ubicacion() {
    return this._ubicacion;
  }

  set ubicacion(ubicacion:string){
    this._ubicacion = ubicacion;
  }
}
