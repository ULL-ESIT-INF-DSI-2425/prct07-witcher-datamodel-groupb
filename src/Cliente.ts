/**
 * Clase que representa un cazador de monstruos u otro cliente.
 * @param _ID - ID único del cliente
 * @param _nombre - Nombre del cliente (Ejemplo: Geralt de Rivia, Ciri, Yennefer de Vengerberg).
 * @param _raza - Raza del cliente (Ejemplo: Humano, Elfo, Enano, Hechicero).
 * @param _ubicacion - Ubicación actual del cliente (Ejemplo: Kaer Morhen, Vizima, Novigrado).
 * @returns Instancia de la clase Cliente.
 */
export default class Cliente {
  constructor(
    private _ID: number,
    private _nombre: string,
    private _raza: string,
    private _ubicacion: string,
  ) {}

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
  
  set nombre(nombre:string){
    this._nombre = nombre;
  }

  /**
   * Getter de la propiedad raza.
   * @returns Raza del cliente.
   */
  get raza() {
    return this._raza;
  }

  set raza(raza:string){
    this._raza = raza;
  }
  
  /**
   * Getter de la propiedad ubicación.
   * @returns Ubicación actual del cliente.
   */
  get ubicacion() {
    return this._ubicacion;
  }

  set ubicacion(ubicacion:string){
    this._ubicacion = ubicacion;
  }
}
