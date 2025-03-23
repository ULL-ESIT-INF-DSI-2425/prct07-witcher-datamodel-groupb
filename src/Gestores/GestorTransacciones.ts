import Cliente from "../Entidades/Cliente.js";
import Transaccion from "../Entidades/Transaccion.js";
import Gestor from "./Gestor.js";
import inquirer from "inquirer";

/**
 * Clase que gestiona las transacciones realizadas en la `Posada del Lobo Blanco`.
 * Extiende de la clase `Gestor`. Contiene un mapa de transacciones.
 * Los datos se almacenan en un fichero JSON.
 * Entre sus funciones están:
 *  - Crear una transacción.
 *  - Añadir una transacción.
 *  - Eliminar una transacción.
 *  - Consultar las ventas.
 *  - Consultar las compras.
 *  - Consultar las devoluciones.
 */
export default class GestorTransacciones extends Gestor<Transaccion> {
  protected _almacenMap = new Map<number, Transaccion>();
  private static GestorInstancia?: GestorTransacciones;

  private constructor(transaccionesArray: Transaccion[]) {
    if (transaccionesArray.length === 1 && transaccionesArray[0].ID === -1) {
      super("BaseDeDatos/Transacciones.json");
      if (this.database.data == null) {
        console.log(
          "No se ha detectado ningún dato en el fichero json. Esto no debería ocurrir",
        );
      } else {
        this.database.data.forEach((transaccion) =>
          this._almacenMap.set(
            transaccion.ID,
            new Transaccion(
              transaccion.ID,
              transaccion.fecha,
              transaccion.bienes,
              transaccion.persona,
              transaccion.devolucion,
            ),
          ),
        );
      }
    } else {
      super("BaseDeDatos/Dummytransacciones.json");
      this.database.data = transaccionesArray;
      this.database.write();
      transaccionesArray.forEach((transaccion) =>
        this._almacenMap.set(transaccion.ID, transaccion),
      );
    }
  }

  update(entidad: Transaccion): void {
    throw new Error("No se pueden modificar las transacciones ya creadas.");
  }

  //Funcion para obtener un ID no usado para una nueva transaccion
  getTransaccionID(): number {
    let newID = 1;
    while (this._almacenMap.has(newID)) {
      newID++;
    }
    return newID;
  }

  public static getGestorInstancia(
    _transaccionesArray: Transaccion[] = [new Transaccion(-1, new Date(), [], new Cliente(-1, "Dummy", "ninguna", "ningun sitio"))],
  ): GestorTransacciones {
    if (!GestorTransacciones.GestorInstancia) {
      GestorTransacciones.GestorInstancia = new GestorTransacciones(
        _transaccionesArray,
      );
    }
    return GestorTransacciones.GestorInstancia;
  }

  static resetInstance(): void {
    GestorTransacciones.GestorInstancia = undefined;
  }
}
