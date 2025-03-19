import Cliente from "./Cliente.js";
import Mercader from "./Mercader.js";
import Bien from "./Bien.js";

import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import { Entidad } from "./Interfaces.js";


export default abstract class Gestor<T extends Entidad> {
    protected database: LowSync<T[]>;
    protected _almacenMap = new Map<number, T>();
  
    constructor(jsonPath: string) {
        this.database = new LowSync(new JSONFileSync(jsonPath));
        this.database.read();
    }

    get almacenMap(): Map<number, T> {
        return this._almacenMap;
    }

    public get(ID : number): T {
        if (!this.almacenMap.has(ID)) {
          throw new Error(`Bien con ID ${ID} no encontrado.`);
        } else {
          return this._almacenMap.get(ID)!;
        }
    }

    /**
    * Función para almacenar el contenido de los Mapas dentro del fichero json.
    * data tiene ! para que el compilador confie en que data no está vacío y no se queje.
    */
    protected storeInventario(): void {
        this.database.data = [...this._almacenMap.values()];
        this.database.write();
    }


    public ImprimirTest(): void {
        this._almacenMap.forEach((element) => {
          console.log(element.nombre);
        });
    }

    public length():number{
        return this.almacenMap.size;
    }

}
  
  