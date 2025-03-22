import Bien from "../Entidades/Bien.js";
import inquirer from "inquirer";
import { JSONFileSync } from "lowdb/node";
import { LowSync } from "lowdb";
import { ElementoAlmacen } from "../Entidades/ElementoAlmacen.js";
import Gestor from "./Gestor.js";

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
export default class Inventario extends Gestor<ElementoAlmacen> {
  protected _almacenMap = new Map<number, ElementoAlmacen>();
  private static GestorInstancia?: Inventario;
  
  private constructor(private _elementosArray: ElementoAlmacen[]) {
    if (_elementosArray.length === 1 && _elementosArray[0].bien.nombre === "dummy") {
      super("BaseDeDatos/Inventario.json");
      if (this.database.data == null) {
        console.log(
          "No se ha detectado ningún dato en el fichero json. Esto no debería ocurrir",
        );
      } else {
        this.database.data.forEach((elemento) =>
          this._almacenMap.set(elemento.ID, new ElementoAlmacen(elemento.bien, elemento.cantidad)),
        );
      }
    } else {
      super("BaseDeDatos/DummyInventario.json");
      this.database.data = _elementosArray
      this.database.write();
      _elementosArray.forEach((elemento) =>
        this._almacenMap.set(elemento.ID, elemento),
      );
    }
  }

  /**
   * Método que añade un elemento al inventario.
   * Si el elemento ya existe, se suma la cantidad.
   * @param elemento - Elemento a añadir.
   */
  add(elemento: ElementoAlmacen): void {
    if(elemento.cantidad <= 0) {
      throw new Error("La cantidad debe ser mayor que 0");
    }
    if (this._almacenMap.has(elemento.ID)) {
      this.get(elemento.ID).cantidad += elemento.cantidad;
    } else {
      this._almacenMap.set(elemento.ID, elemento);
    }
    this.storeInventario();
  }

  /**
   * Getter de la propiedad `almacenMap` que devuelve el inventario.
   * @returns Map - Mapa con los elementos almacenados.
   */
  public static getGestorInstancia(
    elementosArray: ElementoAlmacen[] = [new ElementoAlmacen((new Bien(-1, "dummy", "Bien dummy", "vacio", 0, 0)), 1) ],
  ): Inventario {
    if (!Inventario.GestorInstancia) {
      Inventario.GestorInstancia = new Inventario(elementosArray);
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
          this.add(new ElementoAlmacen(bien, parseInt(answers._cantidad)));
          console.log("Cliente creado y añadido exitosamente");
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error(error.message);
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
      console.log(element.ID);
      if (element && "nombre" in element) console.log(element.bien.nombre);
      if (element) console.log(element.cantidad);
    });
  }
}
