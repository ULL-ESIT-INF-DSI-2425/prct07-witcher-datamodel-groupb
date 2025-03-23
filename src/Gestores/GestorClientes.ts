import Cliente from "../Entidades/Cliente.js";
import Gestor from "./Gestor.js";

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
export default class GestorClientes extends Gestor<Cliente> {
  protected _almacenMap = new Map<number, Cliente>();
  private static GestorInstancia?: GestorClientes;

  private constructor(clientesArray: Cliente[]) {
    if (clientesArray.length === 1 && clientesArray[0].nombre === "dummy") {
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
      super("BaseDeDatos/DummyClientes.json");
      this.database.data = clientesArray;
      this.database.write();
      clientesArray.forEach((cliente) =>
        this._almacenMap.set(cliente.ID, cliente),
      );
    }
  }

  public static getGestorInstancia(
    _clientesArray: Cliente[] = [
      new Cliente(-1, "dummy", "cliente dummy", "tests"),
    ],
  ): GestorClientes {
    if (!GestorClientes.GestorInstancia) {
      GestorClientes.GestorInstancia = new GestorClientes(_clientesArray);
    }
    return GestorClientes.GestorInstancia;
  }

  static resetInstance(): void {
    GestorClientes.GestorInstancia = undefined;
  }

  /**
  * Método que busca bienes según un filtro dado.
  * @param filtro - Filtro a aplicar.
  * @param valor - Valor del filtro.
  * @returns ElementoAlmacen[] - Array con los elementos que cumplen el filtro.
  */
  buscar(filtro: string, valor: string): Cliente[] {
    let elementosFiltrados: Cliente[] = [];
    switch (filtro) {
      case "Nombre":
        elementosFiltrados = Array.from(this._almacenMap.values()).filter(
          (cliente) => cliente.nombre === valor,
        );
        break;
      case "Raza":
        elementosFiltrados = Array.from(this._almacenMap.values()).filter(
          (cliente) => cliente.raza === valor,
        );
        break;
      case "Ubicacion":
        elementosFiltrados = Array.from(this._almacenMap.values()).filter(
          (cliente) => cliente.ubicacion === valor,
        );
        break;
      default:
        console.error("Filtro no válido");
    }
    return elementosFiltrados;
  }

}
