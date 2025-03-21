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

  private constructor(private readonly _transaccionesArray: Transaccion[]) {
    if (_transaccionesArray.length === 1 && _transaccionesArray[0].ID === -1) {
      super("BaseDeDatos/transacciones.json");
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
            ),
          ),
        );
      }
    } else {
      super("BaseDeDatos/Dummytransacciones.json");
      this.database.data = _transaccionesArray;
      this.database.write();
      _transaccionesArray.forEach((transaccion) =>
        this._almacenMap.set(transaccion.ID, transaccion),
      );
    }
  }

  public static getGestorInstancia(
    _transaccionesArray: Transaccion[] = [new Transaccion(-1, new Date(), [])],
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

  public crear(): void {
    inquirer
      .prompt([
        {
          type: "input",
          name: "_ID",
          message: "Ingrese el ID del transaccion:",
          validate(value) {
            const id = Number(value);
            if (isNaN(id)) {
              return "El ID debe ser un número";
            }
            return true;
          },
        },
      ])
      .then((answers) => {
        const transaccion = new Transaccion(
          parseInt(answers._ID), // Convertimos el ID a número
          new Date(),
          [], // Inicializamos bienes en transaccion en vacío
        );

        try {
          this.add(transaccion);
          console.log("transaccion creado y añadido exitosamente");
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error(error.message); // Si el ID ya está en uso, mostramos el error
          } else {
            console.error("Ha ocurrido un error desconocido");
          }
        }
      });
  }
}
