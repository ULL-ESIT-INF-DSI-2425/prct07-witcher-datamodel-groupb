import Bien from "./Bien.js";
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
export default class Inventario extends Gestor<Bien> {

  protected _almacenMap = new Map<number, Bien>();

  constructor(
    _bienesArray: Bien[] = [new Bien(-1,"dummy", "Bien dummy", "vacio", 0, 0, 0)],
  ) {
    if (
      _bienesArray.length === 1 && _bienesArray[0].nombre === "dummy") {
        super("BaseDeDatos/Inventario.json");

      if (this.database.data == null) {
        console.log(
          "No se ha detectado ningún dato en el fichero json. Esto no debería ocurrir",
        );
      } else {
        this.database.data.forEach((bien) =>
          this._almacenMap.set(
            bien.ID,
            new Bien(
              bien.ID,
              bien.nombre,
              bien.descripcion,
              bien.material,
              bien.peso,
              bien.precio,
              bien.cantidad,
            ),
          ),
        );
      }

    } else {
      super("BaseDeDatos/Dummy.json");
      this.database.data = _bienesArray;
      this.database.write();
    }
  }


  /**
   * Eliminar bien de la base de datos
   * @param ID - ID del bien a eliminar
   */
  removeBien(ID: number): void {
    if (!this.almacenMap.has(ID)) {
      throw new Error(`Bien con ID ${ID} no encontrado.`);
    } else {
      this.almacenMap.delete(ID);
      this.storeInventario();
    }
  }

  // TODO: Implementar funciones para consultar información de bienes específicos (ordenación).
  // TODO: Implementar funcion para localizar mercaderes y clientes por su nombre, tipo, raza o ubicación.
  
  /*REVISAR
  venderBien(bien: Bien, cantidad: number, fecha: Date) {
    if (!this.almacenMap.has(bien.ID)) {
      throw new Error(`Bien con ID ${bien.ID} no encontrado.`);
    }
    const bienExistente = this.almacenMap.get(bien.ID);
    if (bienExistente === undefined || bienExistente.cantidad < cantidad) {
      throw new Error(
        `No hay suficientes ${bien.nombre} en stock. Stock actual: ${bien.cantidad}`,
      );
    }
    bienExistente.removeBien(bien.ID);
    this.storeInventario();
  }
  */
}
