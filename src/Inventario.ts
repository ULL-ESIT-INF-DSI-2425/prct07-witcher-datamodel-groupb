import Bien from "./Bien.js";
import Cliente from "./Cliente.js";
import Mercader from "./Mercader.js";

import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";

/**
 * Tipo de datos que se almacenan en el fichero JSON.
 * Contiene un array de bienes, clientes y mercaderes.
 * @param bienes - Array de bienes.
 * @param clientes - Array de clientes.
 * @param mercaderes - Array de mercaderes.
 * @returns Objeto de tipo schemaType.
 */
type schemaType = {
  bienes: Bien[];
  clientes: Cliente[];
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
export default class Inventario {
  private database: LowSync<schemaType>;

  private _bienesMap = new Map<number, Bien>();
  private _clientesMap = new Map<number, Cliente>();
  private _mercaderesMap = new Map<number, Mercader>();

  constructor(
    _bienesArray: Bien[] = [],
    _clientesArray: Cliente[] = [],
    _mercaderesArray: Mercader[] = [],
  ) {
    if (
      _bienesArray.length === 0 &&
      _clientesArray.length === 0 &&
      _mercaderesArray.length === 0
    ) {
      this.database = new LowSync(
        new JSONFileSync("BaseDeDatos/Inventario.json"),
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

        this.database.data.bienes.forEach((bien) =>
          this.bienesMap.set(
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
      this.database = new LowSync(new JSONFileSync("BaseDeDatos/Dummy.json"));
      this.database.read();
      this.database.data = {
        bienes: _bienesArray,
        clientes: _clientesArray,
        mercaderes: _mercaderesArray,
      };
      this.database.write();
    }
  }

  get clientesMap(): Map<number, Cliente> {
    return this._clientesMap;
  }

  get mercaderesMap(): Map<number, Mercader> {
    return this._mercaderesMap;
  }
  get bienesMap(): Map<number, Bien> {
    return this._bienesMap;
  }

  public ImprimirTest(): void {
    this._clientesMap.forEach((element) => {
      console.log(element.nombre);
    });
    this._mercaderesMap.forEach((element) => {
      console.log(element.nombre);
    });
    this._bienesMap.forEach((element) => {
      console.log(element.nombre);
    });
  }

  /**
   * Función para almacenar el contenido de los Mapas dentro del fichero json.
   * data tiene ! para que el compilador confie en que data no está vacío y no se queje.
   */
  private storeInventario(): void {
    this.database.data!.bienes = [...this.bienesMap.values()];
    this.database.data!.clientes = [...this.clientesMap.values()];
    this.database.data!.mercaderes = [...this.mercaderesMap.values()];
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
   * Función para almacenar un nuevo bien en la base de datos
   * @param bien - Bien a añadir, su ID debe ser único
   */
  addBien(bien: Bien): void {
    if (this.bienesMap.has(bien.ID)) {
      throw new Error(`Error, ID ${bien.ID} ya está en uso`);
    } else {
      this.bienesMap.set(bien.ID, bien);
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

  /**
   * Eliminar bien de la base de datos
   * @param ID - ID del bien a eliminar
   */
  removeBien(ID: number): void {
    if (!this.bienesMap.has(ID)) {
      throw new Error(`Bien con ID ${ID} no encontrado.`);
    } else {
      this.bienesMap.delete(ID);
      this.storeInventario();
    }
  }

  // TODO: Implementar funciones para consultar información de bienes específicos (ordenación).
  // TODO: Implementar funcion para localizar mercaderes y clientes por su nombre, tipo, raza o ubicación.
  
  /*REVISAR
  venderBien(bien: Bien, cantidad: number, fecha: Date) {
    if (!this.bienesMap.has(bien.ID)) {
      throw new Error(`Bien con ID ${bien.ID} no encontrado.`);
    }
    const bienExistente = this.bienesMap.get(bien.ID);
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
