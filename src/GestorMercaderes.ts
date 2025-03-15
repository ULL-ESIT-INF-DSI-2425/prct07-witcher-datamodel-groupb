import Mercader from "./Mercader.js";

import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";

/**
 * Tipo de datos que se almacenan en el fichero JSON.
 * Contiene un array de clientes y mercaderes.
 * @param clientes - Array de clientes.
 * @param mercaderes - Array de mercaderes.
 * @returns Objeto de tipo schemaType.
 */
type schemaType = {
  mercaderes: Mercader[];
};

/**
 * Clase que representa el inventario de la `Posada del Lobo Blanco`.
 * Contiene un mapa de bienes, clientes y mercaderes.
 * Los datos se almacenan en un fichero JSON.
 * Entre sus funciones están:
 *  - Añadir un cliente, mercader o bien.
 *  - Eliminar un cliente, mercader o bien.
 *  - Consultar información de bienes específicos.
 *  - Localizar mercaderes y clientes por su nombre, tipo, raza o ubicación.
 *  - Llevar el control automatizado del stock, gestionando la cantidad de bienes disponibles.
 *  - Registrar transacciones, como ventas, compras o devoluciones.
 *  - Generar informes con estado del stock, bienes más vendidos y más demandados, total de ingresos y gastos, etc.
 */
export default class GestorMercaderes {
  private database: LowSync<schemaType>;

  private _mercaderesMap = new Map<number, Mercader>();

  constructor(
    _mercaderesArray: Mercader[] = [new Mercader(-1, "dummy", "mercader dummy", "tests")],
  ) {
    if (
        _mercaderesArray.length === 1 &&
      _mercaderesArray[0].nombre === "dummy"
    ) {
      this.database = new LowSync(
        new JSONFileSync("BaseDeDatos/Mercaderes.json"),
      );
      this.database.read();

      if (this.database.data == null) {
        console.log(
          "No se ha detectado ningún dato en el fichero json. Esto no debería ocurrir",
        );
      } else {
        this.database.data.mercaderes.forEach((mercader) =>
          this.mercaderesMap.set(
            mercader.ID,
            new Mercader(
              mercader.ID,
              mercader.nombre,
              mercader.tipo,
              mercader.ubicacion,
            ),
          ),
        );
      }
    } else {
      this.database = new LowSync(new JSONFileSync("BaseDeDatos/Dummy.json"));
      this.database.read();
      this.database.data = {
        mercaderes: _mercaderesArray,
      };
      this.database.write();
    }
  }


  get mercaderesMap(): Map<number, Mercader> {
    return this._mercaderesMap;
  }

  public ImprimirTest(): void {
    this._mercaderesMap.forEach((element) => {
      console.log(element.nombre);
    });
  }

  /**
   * Función para almacenar el contenido de los Mapas dentro del fichero json.
   * data tiene ! para que el compilador confie en que data no está vacío y no se queje.
   */
  private storeInventario(): void {
    this.database.data!.mercaderes = [...this.mercaderesMap.values()];
    this.database.write();
  }


  /**
   * Función para almacenar un nuevo mercader en la base de datos
   * @param mercader - Mercader a añadir, su ID debe ser único
   */
  addMercader(mercader: Mercader): void {
    if (this.mercaderesMap.has(mercader.ID)) {
      throw new Error(`Error, ID ${mercader.ID} ya está en uso`);
    } else {
      this.mercaderesMap.set(mercader.ID, mercader);
      this.storeInventario();
    }
  }

  /**
   * Eliminar mercader de la base de datos
   * @param ID - ID del mercader a eliminar
   */
  removeMercader(ID: number): void {
    if (!this.mercaderesMap.has(ID)) {
      throw new Error(`Mercader con ID ${ID} no encontrado.`);
    } else {
      this.mercaderesMap.delete(ID);
      this.storeInventario();
    }
  }

}
