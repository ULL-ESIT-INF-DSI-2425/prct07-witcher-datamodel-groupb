import Mercader from "./Mercader.js";
import Gestor from "./Gestor.js";

import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";


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
export default class GestorMercaderes extends Gestor<Mercader>{

  protected _almacenMap = new Map<number, Mercader>();

  constructor(
    _mercaderesArray: Mercader[] = [new Mercader(-1, "dummy", "mercader dummy", "tests")],
  ) {
    if (_mercaderesArray.length === 1 && _mercaderesArray[0].nombre === "dummy") {
      super("BaseDeDatos/Mercaderes.json");

      if (this.database.data == null) {
        console.log(
          "No se ha detectado ningún dato en el fichero json. Esto no debería ocurrir",
        );
      } else {
        this.database.data.forEach((mercader) =>
          this._almacenMap.set(
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
      super("BaseDeDatos/Dummy.json");
      this.database.data = _mercaderesArray;
      this.database.write();
    }
  }



  /**
   * Función para almacenar un nuevo mercader en la base de datos
   * @param mercader - Mercader a añadir, su ID debe ser único
   */
  addMercader(mercader: Mercader): void {
    if (this.almacenMap.has(mercader.ID)) {
      throw new Error(`Error, ID ${mercader.ID} ya está en uso`);
    } else {
      this._almacenMap.set(mercader.ID, mercader);
      this.storeInventario();
    }
  }

  /**
   * Eliminar mercader de la base de datos
   * @param ID - ID del mercader a eliminar
   */
  removeMercader(ID: number): void {
    if (!this.almacenMap.has(ID)) {
      throw new Error(`Mercader con ID ${ID} no encontrado.`);
    } else {
      this.almacenMap.delete(ID);
      this.storeInventario();
    }
  }

}
