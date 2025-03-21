import Bien from "../Entidades/Bien.js";
import inquirer from "inquirer";
import { JSONFileSync } from "lowdb/node";
import { LowSync } from "lowdb";
import { ElementoAlmacen } from "../Entidades/ElementoAlmacen.js";

/**
 * Clase que representa el inventario de la `Posada del Lobo Blanco`.
 * Contiene un mapa de bienes almacenados tal que \<ID, ElementoAlmacen\{Bien, cantidad\}\>.
 * Los datos se almacenan en un fichero JSON.
 * Entre sus funciones están:
 *  - Crear un bien.
 *  - Añadir un bien.
 *  - Eliminar un bien.
 *  - Consultar el inventario.
 */
export default class Inventario {
  protected _almacenMap = new Map<number, ElementoAlmacen>();
  private static GestorInstancia?: Inventario;
  private database: LowSync<ElementoAlmacen[]>;

  private constructor(bienesArray: Bien[]) {
    if (bienesArray.length === 1 && bienesArray[0].nombre === "dummy") {
      this.database = new LowSync(
        new JSONFileSync("BaseDeDatos/Inventario.json"),
      );
      this.database.read();
      if (this.database.data == null) {
        console.log(
          "No se ha detectado ningún dato en el fichero json. Esto no debería ocurrir",
        );
      } else {
        this.database.data.forEach((elemento) =>
          this._almacenMap.set(elemento.bien.ID, {
            bien: elemento.bien,
            cantidad: elemento.cantidad,
          }),
        );
      }
    } else {
      this.database = new LowSync(
        new JSONFileSync("BaseDeDatos/DummyInventario.json"),
      );
      this.database.read();
      this.database.data = this.createElementosAlmacen(bienesArray);
      this.database.write();
    }
  }

  /**
   * Método que crea un array de elementos almacenados a partir de un array de bienes.
   * @param bienesArray - Array de bienes.
   * @returns Array - Array de elementos almacenados.
   */
  private createElementosAlmacen(bienesArray: Bien[]): ElementoAlmacen[] {
    const elementosInventario: ElementoAlmacen[] = [];
    bienesArray.forEach((bien) => {
      const elementoExistente = elementosInventario.find(
        (e) => e.bien.ID === bien.ID,
      );
      if (elementoExistente) {
        elementoExistente.cantidad += 1;
      } else {
        elementosInventario.push({ bien, cantidad: 1 });
      }
    });

    return elementosInventario;
  }

  /**
   * Getter de la propiedad `almacenMap` que devuelve el inventario.
   * @returns Map - Mapa con los elementos almacenados.
   */
  public static getGestorInstancia(
    _bienesArray: Bien[] = [new Bien(-1, "dummy", "Bien dummy", "vacio", 0, 0)],
  ): Inventario {
    if (!Inventario.GestorInstancia) {
      Inventario.GestorInstancia = new Inventario(_bienesArray);
    }
    return Inventario.GestorInstancia;
  }

  /**
   * Método que resetea la instancia del inventario.
   */
  static resetInstance(): void {
    Inventario.GestorInstancia = undefined;
  }

  /**
   * Método que crea un bien. Se usa inquier para preguntar al usuario los datos del bien.
   * @returns void
   */
  public crear(): void {
    inquirer
      .prompt([
        {
          type: "input",
          name: "_ID",
          message: "Ingrese el ID del bien:",
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
          message: "Ingrese el nombre del bien:",
          validate(value) {
            return value.trim() !== ""
              ? true
              : "El nombre no puede estar vacío";
          },
        },
        {
          type: "input",
          name: "_descripcion",
          message: "Ingrese la descripción del bien:",
          validate(value) {
            return value.trim() !== ""
              ? true
              : "La descripción no puede estar vacía";
          },
        },
        {
          type: "input",
          name: "_material",
          message: "Ingrese el material del bien:",
          validate(value) {
            return value.trim() !== ""
              ? true
              : "El material no puede estar vacío";
          },
        },
        {
          type: "input",
          name: "_peso",
          message: "Ingrese el peso del bien (kg):",
          validate(value) {
            const peso = Number(value);
            if (isNaN(peso) || peso <= 0) {
              return "El peso debe ser un número mayor que 0";
            }
            return true;
          },
        },
        {
          type: "input",
          name: "_precio",
          message: "Ingrese el precio del bien:",
          validate(value) {
            const precio = Number(value);
            if (isNaN(precio) || precio < 0) {
              return "El precio debe ser un número positivo";
            }
            return true;
          },
        },
        {
          type: "input",
          name: "_cantidad",
          message: "Ingrese la cantidad del bien:",
          validate(value) {
            const cantidad = Number(value);
            if (isNaN(cantidad) || cantidad < 0) {
              return "La cantidad debe ser un número positivo";
            }
            return true;
          },
        },
      ])
      .then((answers) => {
        const bien = new Bien(
          parseInt(answers._ID), // Convertimos el ID a número
          answers._nombre,
          answers._descripcion,
          answers._material,
          parseFloat(answers._peso), // Convertimos peso a número
          parseFloat(answers._precio), // Convertimos precio a número
        );
        try {
          if (this._almacenMap.has(bien.ID)) {
            throw new Error("El ID ya está en uso");
          }
          this._almacenMap.set(bien.ID, {
            bien,
            cantidad: parseInt(answers._cantidad),
          });
          console.log("Bien creado y añadido exitosamente");
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error(error.message); // Si el ID ya está en uso, mostramos el error
          } else {
            console.error("Ha ocurrido un error desconocido");
          }
        }
      });
  }

  /**
   * Método que imprime el contenido del inventario.
   * Se usa para comprobar que los datos se han almacenado correctamente.
   * @returns void
   */
  public ImprimirTest(): void {
    this._almacenMap.forEach((element) => {
      console.log(element.bien.ID);
      if (element && "nombre" in element) console.log(element.bien.nombre);
      if (element) console.log(element.cantidad);
    });
  }
}
