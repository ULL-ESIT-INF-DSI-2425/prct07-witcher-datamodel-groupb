import Cliente from "./Cliente.js";
import Mercader from "./Mercader.js";
import Bien from "./Bien.js";

import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import { Entidad } from "./Interfaces.js";
import { resourceUsage } from "process";
import { resourceLimits } from "worker_threads";


export default abstract class Gestor<T extends Entidad> {
    protected database: LowSync<T[]>;
    protected _almacenMap = new Map<number, T>();

    //abstract resetInstance():void;
  
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

    public getArray():T[]{
        let result:T[] = [];

        this._almacenMap.forEach(element => {
            result.push(element);
        });

        return result;
    }

    /**
    * Función para almacenar el contenido de los Mapas dentro del fichero json.
    * data tiene ! para que el compilador confie en que data no está vacío y no se queje.
    */
    protected storeInventario(): void {
        this.database.data = [...this._almacenMap.values()];
        this.database.write();
    }


    /**
    * Función para almacenar una nueva entidad en la base de datos
    * @param entidad - entidad a añadir, su ID debe ser único
    */
    add(entidad: T): void {
        if (this.almacenMap.has(entidad.ID)) {
            throw new Error(`Error, ID ${entidad.ID} ya está en uso`);
        } else {
            this._almacenMap.set(entidad.ID, entidad);
            this.storeInventario();
        }
    }

    /**
    * Eliminar entidad de la base de datos
    * @param ID - ID de la entidad a eliminar
    */
    remove(ID: number): void {
        if (!this.almacenMap.has(ID)) {
            throw new Error(`Entidad con ID ${ID} no encontrado.`);
        } else {
            this.almacenMap.delete(ID);
            this.storeInventario();
        }
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
  
  