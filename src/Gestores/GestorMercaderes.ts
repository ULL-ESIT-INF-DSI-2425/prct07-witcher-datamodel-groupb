import Mercader from "../Entidades/Mercader.js";
import Gestor from "./Gestor.js";
import inquirer from "inquirer";

/**
 * Clase que representa el inventario de la `Posada del Lobo Blanco`.
 * Contiene un mapa de bienes, mercaders y mercaderes.
 * Los datos se almacenan en un fichero JSON.
 * Entre sus funciones están:
 *  - Añadir un mercader, mercader o bien.
 *  - Eliminar un mercader, mercader o bien.
 *  - Consultar información de bienes específicos.
 *  - Localizar mercaderes y mercaders por su nombre, tipo, raza o ubicación.
 *  - Llevar el control automatizado del stock, gestionando la cantidad de bienes disponibles.
 *  - Registrar transacciones, como ventas, compras o devoluciones.
 *  - Generar informes con estado del stock, bienes más vendidos y más demandados, total de ingresos y gastos, etc.
 */
export default class GestorMercaderes extends Gestor<Mercader> {
  protected _almacenMap = new Map<number, Mercader>();
  private static GestorInstancia?: GestorMercaderes;

  private constructor(_mercaderesArray: Mercader[]) {
    if (
      _mercaderesArray.length === 1 &&
      _mercaderesArray[0].nombre === "dummy"
    ) {
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
      super("BaseDeDatos/DummyMercaderes.json");
      this.database.data = _mercaderesArray;
      this.database.write();
      _mercaderesArray.forEach((mercader) =>
        this._almacenMap.set(mercader.ID, mercader),
      );
    }
  }

  public static getGestorInstancia(
    _mercaderesArray: Mercader[] = [
      new Mercader(-1, "dummy", "mercader dummy", "tests"),
    ],
  ): GestorMercaderes {
    if (!GestorMercaderes.GestorInstancia) {
      GestorMercaderes.GestorInstancia = new GestorMercaderes(_mercaderesArray);
    }
    return GestorMercaderes.GestorInstancia;
  }

  static resetInstance(): void {
    GestorMercaderes.GestorInstancia = undefined;
  }

  public crear(): void {
    inquirer
      .prompt([
        {
          type: "input",
          name: "_ID",
          message: "Ingrese el ID del mercader:",
          validate(value) {
            const id = Number(value);
            if (isNaN(id)) {
              return "El ID debe ser un número";
            }
            return true;
          },
        },
        {
          type: "input",
          name: "_nombre",
          message: "Ingrese el nombre del mercader:",
          validate(value) {
            if (value.trim() === "") {
              return "El nombre no puede estar vacío";
            }
            return true;
          },
        },
        {
          type: "input",
          name: "_tipo",
          message: "Ingrese el tipo del mercader:",
          validate(value) {
            if (value.trim() === "") {
              return "El tipo no puede estar vacío";
            }
            return true;
          },
        },
        {
          type: "input",
          name: "_ubicacion",
          message: "Ingrese la ubicación del mercader:",
          validate(value) {
            if (value.trim() === "") {
              return "La ubicación no puede estar vacía";
            }
            return true;
          },
        },
      ])
      .then((answers) => {
        const mercader = new Mercader(
          parseInt(answers._ID), // Convertimos el ID a número
          answers._nombre,
          answers._tipo,
          answers._ubicacion,
        );

        try {
          this.add(mercader);
          console.log("Mercader creado y añadido exitosamente");
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
