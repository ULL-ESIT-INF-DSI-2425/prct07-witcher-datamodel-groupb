import { Entidad } from "./Entidad.js";

import inquirer from "inquirer";

/**
 * Clase que representa un cazador de monstruos u otro cliente.
 * @param _ID - ID único del cliente
 * @param _nombre - Nombre del cliente (Ejemplo: Geralt de Rivia, Ciri, Yennefer de Vengerberg).
 * @param _raza - Raza del cliente (Ejemplo: Humano, Elfo, Enano, Hechicero).
 * @param _ubicacion - Ubicación actual del cliente (Ejemplo: Kaer Morhen, Vizima, Novigrado).
 * @returns Instancia de la clase Cliente.
 */
export default class Cliente implements Entidad {
  constructor(
    private readonly _ID: number,
    private _nombre: string,
    private _raza: string,
    private _ubicacion: string,
  ) {}

  /**
   * Método que devuelve un JSON con los detalles del cliente.
   * @returns Record\<string, number | string\> - JSON con detalles del cliente.
   */
  toJSON(): Record<string, number | string> {
    return {
      ID: this._ID,
      nombre: this._nombre,
      raza: this._raza,
      ubicacion: this._ubicacion,
    };
  }

  static fromJSON(json: any): Cliente {
    return new Cliente(json.ID, json.nombre, json.raza, json.ubicacion);
  }

  tostring():string{
    return `ID: ${this._ID}, Nombre: ${this._nombre}, Raza: ${this._raza}, Ubicación: ${this._ubicacion}`;
  }

  /**
   * Getter de la propiedad ID.
   * @returns ID del cliente.
   */
  get ID() {
    return this._ID;
  }
  /**
   * Getter de la propiedad nombre.
   * @returns Nombre del cliente.
   */
  get nombre() {
    return this._nombre;
  }

  /**
   * Setter de la propiedad nombre.
   * @param nombre - Nombre del cliente.
   */
  set nombre(nombre: string) {
    this._nombre = nombre;
  }

  /**
   * Getter de la propiedad raza.
   * @returns Raza del cliente.
   */
  get raza() {
    return this._raza;
  }

  /**
   * Setter de la propiedad raza.
   * @param raza - Raza del cliente.
   */
  set raza(raza: string) {
    this._raza = raza;
  }

  /**
   * Getter de la propiedad ubicación.
   * @returns Ubicación actual del cliente.
   */
  get ubicacion() {
    return this._ubicacion;
  }

  /**
   * Setter de la propiedad ubicación.
   * @param ubicacion - Ubicación actual del cliente.
   */
  set ubicacion(ubicacion: string) {
    this._ubicacion = ubicacion;
  }

  static crear(callback: (cliente: Cliente | undefined, error?: Error) => void): void {
    inquirer
      .prompt([
        {
          type: "input",
          name: "_ID",
          message: "Ingrese el ID del cliente:",
          validate(value) {
            const id = Number(value);
            return isNaN(id) || id <= 0 ? "El ID debe ser un número mayor a cero" : true;
          },
        },
        {
          type: "input",
          name: "_nombre",
          message: "Ingrese el nombre del cliente:",
          validate(value) {
            return value.trim() === "" ? "El nombre no puede estar vacío" : true;
          },
        },
        {
          type: "input",
          name: "_raza",
          message: "Ingrese la raza del cliente:",
          validate(value) {
            return value.trim() === "" ? "La raza no puede estar vacía" : true;
          },
        },
        {
          type: "input",
          name: "_ubicacion",
          message: "Ingrese la ubicación del cliente:",
          validate(value) {
            return value.trim() === "" ? "La ubicación no puede estar vacía" : true;
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
        
        // Validación extra para _raza
        if (answers._raza.trim() === "") {
          return callback(undefined, new Error("La raza no puede estar vacía"));
        }
        
        // Validación extra para _ubicacion
        if (answers._ubicacion.trim() === "") {
          return callback(undefined, new Error("La ubicación no puede estar vacía"));
        }
        
        // Si todo es válido, se crea la instancia de Cliente
        const cliente = new Cliente(
          id,
          answers._nombre,
          answers._raza,
          answers._ubicacion,
        );
        callback(cliente);
      })
      .catch((error) => {
        callback(undefined, error);
      });
  }
  
}
