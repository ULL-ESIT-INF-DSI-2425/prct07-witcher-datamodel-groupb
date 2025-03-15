import Cliente from "./Cliente.js";

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
  clientes: Cliente[];
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
export default class GestorClientes {
  private database: LowSync<schemaType>;

  private _clientesMap = new Map<number, Cliente>();

  constructor(
    _clientesArray: Cliente[] = [new Cliente(-1, "dummy", "cliente dummy", "tests")],
  ) {
    if (
        _clientesArray.length === 1 &&
      _clientesArray[0].nombre === "dummy"
    ) {
      this.database = new LowSync(
        new JSONFileSync("BaseDeDatos/Clientes.json"),
      );
      this.database.read();

      if (this.database.data == null) {
        console.log(
          "No se ha detectado ningún dato en el fichero json. Esto no debería ocurrir",
        );
      } else {
        this.database.data.clientes.forEach((cliente) =>
          this.clientesMap.set(
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
      this.database = new LowSync(new JSONFileSync("BaseDeDatos/Dummy.json"));
      this.database.read();
      this.database.data = {
        clientes: _clientesArray,
      };
      this.database.write();
    }
  }

  get clientesMap(): Map<number, Cliente> {
    return this._clientesMap;
  }


  public ImprimirTest(): void {
    this._clientesMap.forEach((element) => {
      console.log(element.nombre);
    });
  }

  /**
   * Función para almacenar el contenido de los Mapas dentro del fichero json.
   * data tiene ! para que el compilador confie en que data no está vacío y no se queje.
   */
  private storeInventario(): void {
    this.database.data!.clientes = [...this.clientesMap.values()];
    this.database.write();
  }

  /**
   * Función para almacenar un nuevo cliente en la base de datos
   * @param cliente - Cliente a añadir, su ID debe ser único
   */
  addCliente(cliente: Cliente): void {
    if (this.clientesMap.has(cliente.ID)) {
      throw new Error(`Error, ID ${cliente.ID} ya está en uso`);
    } else {
      this.clientesMap.set(cliente.ID, cliente);
      this.storeInventario();
    }
  }


  /**
   * Eliminar cliente de la base de datos
   * @param ID - ID del cliente a eliminar
   */
  removeCliente(ID: number): void {
    if (!this.clientesMap.has(ID)) {
      throw new Error(`Cliente con ID ${ID} no encontrado.`);
    } else {
      this.clientesMap.delete(ID);
      this.storeInventario();
    }
  }

}
