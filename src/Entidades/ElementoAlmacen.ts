import { Entidad } from "./Entidad.js";
import Bien from "./Bien.js";
import inquirer from "inquirer";
/**
 * Interfaz que representa un elemento almacenado en el inventario.
 * Contiene un bien y la cantidad de ese bien almacenada.
 */
export default class ElementoAlmacen implements Entidad {
  public readonly ID: number;

  constructor(
    public bien: Bien,
    public cantidad: number,
  ) {
    this.ID = bien.ID;
  }

  toJSON(): Record<string, number | string> {
    const bienjson = this.bien.toJSON();
    const bienjsonstring = JSON.stringify(bienjson);
    return {
      ID: this.ID,
      bien: bienjsonstring,
      cantidad: this.cantidad,
    };
  }

  /**
   * Método que crea un Elemento del almacén. Se usa inquier para preguntar al usuario los datos del bien.
   * @returns void
   */
  static crear(callback: (elemento: ElementoAlmacen | undefined, error?: Error) => void): void {
    inquirer
      .prompt([
        {
          type: "input",
          name: "_ID",
          message: "Ingrese el ID del bien:",
          validate(value) {
            const id = Number(value);
            return isNaN(id) || id <= 0 ? "El ID debe ser un número mayor a cero" : true;
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
            return isNaN(peso) || peso <= 0
              ? "El peso debe ser un número mayor que 0"
              : true;
          },
        },
        {
          type: "input",
          name: "_precio",
          message: "Ingrese el precio del bien:",
          validate(value) {
            const precio = Number(value);
            return isNaN(precio) || precio < 0
              ? "El precio debe ser un número positivo"
              : true;
          },
        },
        {
          type: "input",
          name: "_cantidad",
          message: "Ingrese la cantidad del bien:",
          validate(value) {
            const cantidad = Number(value);
            return isNaN(cantidad) || cantidad < 0
              ? "La cantidad debe ser un número positivo"
              : true;
          },
        },
      ])
      .then((answers) => {
        // Validación extra para _ID
        const id = parseInt(answers._ID);
        if (isNaN(id) || id <= 0) {
          return callback(undefined, new Error("El ID debe ser un número mayor a 0"));
        }
  
        // Validación extra para _nombre
        if (answers._nombre.trim() === "") {
          return callback(undefined, new Error("El nombre no puede estar vacío"));
        }
  
        // Validación extra para _descripcion
        if (answers._descripcion.trim() === "") {
          return callback(undefined, new Error("La descripción no puede estar vacía"));
        }
  
        // Validación extra para _material
        if (answers._material.trim() === "") {
          return callback(undefined, new Error("El material no puede estar vacío"));
        }
  
        // Validación extra para _peso
        const peso = parseFloat(answers._peso);
        if (isNaN(peso) || peso <= 0) {
          return callback(undefined, new Error("El peso debe ser un número mayor que 0"));
        }
  
        // Validación extra para _precio
        const precio = parseFloat(answers._precio);
        if (isNaN(precio) || precio < 0) {
          return callback(undefined, new Error("El precio debe ser un número positivo"));
        }
  
        // Validación extra para _cantidad
        const cantidad = parseInt(answers._cantidad);
        if (isNaN(cantidad) || cantidad < 0) {
          return callback(undefined, new Error("La cantidad debe ser un número positivo"));
        }
  
        // Si todas las validaciones son correctas, se crea el bien
        const bien = new Bien(
          id,
          answers._nombre,
          answers._descripcion,
          answers._material,
          peso,
          precio,
        );
  
        // Se crea el elemento del almacén
        const elemento = new ElementoAlmacen(bien, cantidad);
        callback(elemento);
      })
      .catch((error) => {
        callback(undefined, error);
      });
  }
}
