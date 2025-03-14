export default class Cliente {
  constructor(
    private _ID: number,
    private _nombre: string,
    private _raza: string,
    private _ubicacion: string,
  ) {}

  get ID() {
    return this._ID;
  }
  get nombre() {
    return this._nombre;
  }
  get raza() {
    return this._raza;
  }
  get ubicacion() {
    return this._ubicacion;
  }
}
