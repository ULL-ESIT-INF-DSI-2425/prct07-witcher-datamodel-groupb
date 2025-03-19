import Cliente from "./Cliente.js";
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
export default class GestorClientes extends Gestor<Cliente>{

  protected _almacenMap = new Map<number, Cliente>();

  constructor(
    _clientesArray: Cliente[] = [new Cliente(-1, "dummy", "cliente dummy", "tests")],
  ) {
    
    if (_clientesArray.length === 1 && _clientesArray[0].nombre === "dummy") {
      super("BaseDeDatos/Clientes.json");
      if (this.database.data == null) {
        console.log(
          "No se ha detectado ningún dato en el fichero json. Esto no debería ocurrir",
        );
      } else {
        this.database.data.forEach((cliente) =>
          this._almacenMap.set(
            cliente.ID,
            new Cliente(
              cliente.ID,
              cliente.nombre,
              cliente.raza,
              cliente.ubicacion,
            ),
          ),
        );
      }
    } else {
    super("BaseDeDatos/Dummy.json");
      this.database.data = _clientesArray;
      this.database.write();
    }
  }

  /**
   * Función para almacenar un nuevo cliente en la base de datos
   * @param cliente - Cliente a añadir, su ID debe ser único
   */
  addCliente(cliente: Cliente): void {
    if (this.almacenMap.has(cliente.ID)) {
      throw new Error(`Error, ID ${cliente.ID} ya está en uso`);
    } else {
      this._almacenMap.set(cliente.ID, cliente);
      this.storeInventario();
    }
  }


  /**
   * Eliminar cliente de la base de datos
   * @param ID - ID del cliente a eliminar
   */
  removeCliente(ID: number): void {
    if (!this.almacenMap.has(ID)) {
      throw new Error(`Cliente con ID ${ID} no encontrado.`);
    } else {
      this.almacenMap.delete(ID);
      this.storeInventario();
    }
  }

}
