import { Entidad } from "./Entidad.js";
import inquirer from "inquirer";

/**
 * Clase que representa un mercader.
 * @param _ID - ID único del mercader
 * @param _nombre - Nombre del mercader (Ejemplo: Hattori, Fergus Graem).
 * @param _tipo - Tipo de mercader (Ejemplo: Herrero, Alquimista, Mercader General).
 * @param _ubicacion - Ubicación del mercader (Ejemplo: Novigrado, Velen, Kaer Trolde).
 * @returns Instancia de la clase Mercader.
 */
export default class Mercader implements Entidad {
  constructor(
    private readonly _ID: number,
    private _nombre: string,
    private _tipo: string,
    private _ubicacion: string,
  ) {}

  /**
   * Método que devuelve un JSON con los detalles del mercader.
   * @returns Record\<string, number | string\> - JSON con detalles del mercader.
   */
  toJSON(): Record<string, number | string> {
    return {
      ID: this._ID,
      nombre: this._nombre,
      tipo: this._tipo,
      ubicacion: this._ubicacion,
    };
  }
  static fromJSON(json: any): Mercader {
    return new Mercader(json.ID, json.nombre, json.tipo, json.ubicacion);
  }

  tostring(): string {
    return `ID: ${this._ID}, Nombre: ${this._nombre}, Tipo: ${this._tipo}, Ubicación: ${this._ubicacion}`;
  }

  /**
   * Getter de la propiedad ID.
   * @returns ID del mercader.
   */
  get ID() {
    return this._ID;
  }

  /**
   * Getter de la propiedad nombre.
   * @returns Nombre del mercader.
   */
  get nombre() {
    return this._nombre;
  }

  /**
   * Setter de la propiedad nombre.
   * @param nombre - Nombre del mercader.
   */
  set nombre(nombre: string) {
    this._nombre = nombre;
  }

  /**
   * Getter de la propiedad tipo.
   * @returns Tipo de mercader.
   */
  get tipo() {
    return this._tipo;
  }

  /**
   * Setter de la propiedad tipo.
   * @param tipo - Tipo de mercader.
   */
  set tipo(tipo: string) {
    this._tipo = tipo;
  }

  /**
   * Getter de la propiedad ubicación.
   * @returns Ubicación del mercader.
   */
  get ubicacion() {
    return this._ubicacion;
  }

  /**
   * Setter de la propiedad ubicación.
   * @param ubicacion - Ubicación del mercader.
   */
  set ubicacion(ubicacion: string) {
    this._ubicacion = ubicacion;
  }

  static crear(callback: (mercader: Mercader | undefined, error?: Error) => void): void {
    inquirer
      .prompt([
        {
          type: "input",
          name: "_ID",
          message: "Ingrese el ID del mercader:",
          validate(value) {
            const id = Number(value);
            return isNaN(id) || id <= 0 ? "El ID debe ser un número mayor a cero" : true;
          },
        },
        {
          type: "input",
          name: "_nombre",
          message: "Ingrese el nombre del mercader:",
          validate(value) {
            return value.trim() === "" ? "El nombre no puede estar vacío" : true;
          },
        },
        {
          type: "input",
          name: "_tipo",
          message: "Ingrese el tipo del mercader:",
          validate(value) {
            return value.trim() === "" ? "El tipo no puede estar vacío" : true;
          },
        },
        {
          type: "input",
          name: "_ubicacion",
          message: "Ingrese la ubicación del mercader:",
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
        if (answers._tipo.trim() === "") {
          return callback(undefined, new Error("El tipo no puede estar vacío"));
        }
        
        // Validación extra para _ubicacion
        if (answers._ubicacion.trim() === "") {
          return callback(undefined, new Error("La ubicación no puede estar vacía"));
        }
        
        // Si todo es válido, se crea la instancia de mercader
        const mercader = new Mercader(
          id,
          answers._nombre,
          answers._tipo,
          answers._ubicacion,
        );
        callback(mercader);
      })
      .catch((error) => {
        callback(undefined, error);
      });
  }
}
