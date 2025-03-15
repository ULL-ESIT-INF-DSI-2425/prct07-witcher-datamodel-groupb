/**
 * Clase que representa un bien.
 * @param _ID - ID único del bien
 * @param _nombre - Nombre del bien (Ejemplo: Espada de Plata de Kaer Morhen, Elixires de Golondrina).
 * @param _descripcion - Descripción del bien. Narra su origen y utilidad.
 * @param _material - Material del que está hecho el bien (Ejemplo: Acero de Mahakam, cuero endurecido, esencia mágica o mutágenos de bestias antiguas).
 * @param _peso - Peso del bien en kilogramos.
 * @param _precio - Precio del bien en coronas.
 * @param _cantidad - Cantidad de bienes en stock.
 * @returns Instancia de la clase Bien.
 */
export default class Bien {
  constructor(
    private _ID: number,
    private _nombre: string,
    private _descripcion: string,
    private _material: string,
    private _peso: number,
    private _precio: number,
    private _cantidad: number,
  ) {}

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

  set nombre(nombre:string){
    this._nombre = nombre;
  }

  /**
   * Getter de la propiedad descripción.
   * @returns Descripción del bien.
   */
  get descripcion() {
    return this._descripcion;
  }

  set descripcion(descripcion:string){
    this._descripcion = descripcion;
  }

  /**
   * Getter de la propiedad material.
   * @returns Material del bien.
   */
  get material() {
    return this._material;
  }

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

  set precio(precio: number) {
    if (precio < 0) {
      throw new Error("El precio no puede ser negativo.");
    }
    this._precio = precio;
  }

  /**
   * Getter de la propiedad cantidad.
   * @returns Cantidad de bienes en stock.
   */
  get cantidad() {
    return this._cantidad;
  }

  set cantidad(cantidad: number) {
    if (!Number.isInteger(cantidad) || cantidad < 0) {
      throw new Error("La cantidad debe ser un número entero no negativo.");
    }
    this._cantidad = cantidad;
  }
  
}
