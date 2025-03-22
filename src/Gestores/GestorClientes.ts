import Cliente from "../Entidades/Cliente.js";
import Gestor from "./Gestor.js";
import inquirer from "inquirer";

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

  private constructor(private readonly _clientesArray: Cliente[]) {
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
      super("BaseDeDatos/DummyClientes.json");
      this.database.data = _clientesArray;
      this.database.write();
      _clientesArray.forEach((cliente) =>
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

  public crear(): void {
    inquirer
      .prompt([
        {
          type: "input",
          name: "_ID",
          message: "Ingrese el ID del cliente:",
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
          message: "Ingrese el nombre del cliente:",
          validate(value) {
            if (value.trim() === "") {
              return "El nombre no puede estar vacío";
            }
            return true;
          },
        },
        {
          type: "input",
          name: "_raza",
          message: "Ingrese la raza del cliente:",
          validate(value) {
            if (value.trim() === "") {
              return "La raza no puede estar vacía";
            }
            return true;
          },
        },
        {
          type: "input",
          name: "_ubicacion",
          message: "Ingrese la ubicación del cliente:",
          validate(value) {
            if (value.trim() === "") {
              return "La ubicación no puede estar vacía";
            }
            return true;
          },
        },
      ])
      .then((answers) => {
        const cliente = new Cliente(
          parseInt(answers._ID), // Convertimos el ID a número
          answers._nombre,
          answers._raza,
          answers._ubicacion,
        );

        try {
          this.add(cliente);
          console.log("Cliente creado y añadido exitosamente");
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
