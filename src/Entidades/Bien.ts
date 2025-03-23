import { Entidad } from "./Entidad.js";

/**
 * Clase que representa un bien.
 * @param _ID - ID único del bien
 * @param _nombre - Nombre del bien (Ejemplo: Espada de Plata de Kaer Morhen, Elixires de Golondrina).
 * @param _descripcion - Descripción del bien. Narra su origen y utilidad.
 * @param _material - Material del que está hecho el bien (Ejemplo: Acero de Mahakam, cuero endurecido, esencia mágica o mutágenos de bestias antiguas).
 * @param _peso - Peso del bien en kilogramos.
 * @param _precio - Precio del bien en coronas.
 * @returns Instancia de la clase Bien.
 */
export default class Bien implements Entidad {
  constructor(
    private readonly _ID: number,
    private _nombre: string,
    private _descripcion: string,
    private _material: string,
    private _peso: number,
    private _precio: number,
  ) {}

  /**
   * Método que devuelve una cadena con toda la información del bien.
   * @returns String - Cadena con la información del bien.
   */
  toJSON(): Record<string, number | string> {
    return {
      ID: this._ID,
      nombre: this._nombre,
      descripcion: this._descripcion,
      material: this._material,
      peso: this._peso,
      precio: this._precio,
    };
  }

  static fromJSON(json: any): Bien {
    return new Bien(json.ID, json.nombre, json.descripcion, json.material, json.peso, json.precio);
  }

  tostring(): string {
    return `ID: ${this._ID}, Nombre: ${this._nombre}, Descripción: ${this._descripcion}, Material: ${this._material}, Peso: ${this._peso}, Precio: ${this._precio}`;
  }

  /**
   * Getter de la propiedad ID.
   * @returns ID del bien.
   */
  get ID() {
    return this._ID;
  }

  /**
   * Getter de la propiedad nombre.
   * @returns Nombre del bien.
   */
  get nombre() {
    return this._nombre;
  }

  /**
   * Setter de la propiedad nombre.
   * @param nombre - Nombre del bien.
   */
  set nombre(nombre: string) {
    this._nombre = nombre;
  }

  /**
   * Getter de la propiedad descripción.
   * @returns Descripción del bien.
   */
  get descripcion() {
    return this._descripcion;
  }

  /**
   * Setter de la propiedad descripción.
   * @param descripcion - Descripción del bien.
   */
  set descripcion(descripcion: string) {
    this._descripcion = descripcion;
  }

  /**
   * Getter de la propiedad material.
   * @returns Material del bien.
   */
  get material() {
    return this._material;
  }

  /**
   * Setter de la propiedad material.
   * @param material - Material del bien.
   */
  set material(material: string) {
    this._material = material;
  }

  /**
   * Getter de la propiedad peso.
   * @returns Peso del bien.
   */
  get peso() {
    return this._peso;
  }

  /**
   * Setter de la propiedad peso.
   * @param peso - Peso del bien.
   */
  set peso(peso: number) {
    if (peso <= 0) {
      throw new Error("El peso debe ser un valor positivo.");
    }
    this._peso = peso;
  }

  /**
   * Getter de la propiedad precio.
   * @returns Precio del bien.
   */
  get precio() {
    return this._precio;
  }

  /**
   * Setter de la propiedad precio.
   * @param precio - Precio del bien.
   * @throws Error si el precio es negativo.
   */
  set precio(precio: number) {
    if (precio < 0) {
      throw new Error("El precio no puede ser negativo.");
    }
    this._precio = precio;
  }
}
