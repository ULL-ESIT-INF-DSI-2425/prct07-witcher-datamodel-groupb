import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import { Entidad } from "../Entidades/Entidad.js";

export default abstract class Gestor<T extends Entidad> {
  protected database: LowSync<T[]>;
  protected _almacenMap = new Map<number, T>();

  // abstract resetInstance():void;

  constructor(jsonPath: string) {
    this.database = new LowSync(new JSONFileSync(jsonPath));
    this.database.read();
  }

  /**
   * Getter de la propiedad `database`.
   * @returns LowSync - Objeto LowDB que administra el fichero json
   */
  get almacenMap(): Map<number, T> {
    return this._almacenMap;
  }

  /**
   * Getter de la propiedad `almacenMap`.
   * @returns Map - Mapa con los elementos almacenados
   */
  public get(ID: number): T {
    if (!this.almacenMap.has(ID)) {
      throw new Error(`Bien con ID ${ID} no encontrado.`);
    } else {
      return this._almacenMap.get(ID)!;
    }
  }

  /**
   * Función para obtener un array con todos los elementos del Mapa `almacenMap`.
   * @returns Array - Todos los elementos del almacen
   */
  public getArray(): T[] {
    const result: T[] = [];

    this._almacenMap.forEach((element) => {
      result.push(element);
    });

    return result;
  }

  /**
   * Función para almacenar el contenido de los Mapas dentro del fichero json.
   * data tiene ! para que el compilador confie en que data no está vacío y no se queje.
   */
  protected storeInventario(): void {
    this.database.data = [...this._almacenMap.values()].map((obj) =>
      JSON.parse(JSON.stringify(obj)),
    );
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

  /**
   * Función para actualizar una entidad en la base de datos.
   * @param entidad - entidad a actualizar
   */
  update(entidad: T): void {
    if (!this.almacenMap.has(entidad.ID)) {
      throw new Error(`Entidad con ID ${entidad.ID} no encontrado.`);
    } else {
      this._almacenMap.set(entidad.ID, entidad);
      this.storeInventario();
    }
  }

  /**
   * Función para imprimir el contenido del Mapa `almacenMap`.
   * Se usa para comprobar que los datos se han almacenado correctamente.
   * @returns void
   */
  public ImprimirTest(): void {
    this._almacenMap.forEach((element) => {
      console.log(element.ID);
      if (element && "nombre" in element) console.log(element.nombre);
    });
  }

  /**
   * Función para obtener el número de elementos en el Mapa `almacenMap`.
   * @returns number - Número de elementos en el Mapa
   */
  public length(): number {
    return this.almacenMap.size;
  }
}
