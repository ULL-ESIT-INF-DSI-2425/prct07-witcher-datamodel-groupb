export default class Mercader {
  constructor(
    private _ID: number,
    private _nombre: string,
    private _tipo: string,
    private _ubicacion: string,
  ) {}
  get ID() {
    return this._ID;
  }
  get nombre() {
    return this._nombre;
  }
  get tipo() {
    return this._tipo;
  }
  get ubicacion() {
    return this._ubicacion;
  }
}
