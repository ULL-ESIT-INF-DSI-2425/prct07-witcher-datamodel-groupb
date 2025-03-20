import { Entidad } from "./Entidad.js";

export default class Transaccion implements Entidad{
    constructor(
        private readonly _ID: number,
    ) {}

    toJSON(): Record<string, number|string> {
        return {
          ID: this._ID,
        };
    }

    
    /**
    * Getter de la propiedad ID.
    * @returns ID del mercader.
    */
    get ID() {
        return this._ID;
    }
}