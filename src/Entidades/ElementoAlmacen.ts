import Bien from "../Entidades/Bien.js";
import { Entidad } from "./Entidad.js";

/**
 * Interfaz que representa un elemento almacenado en el inventario.
 * Contiene un bien y la cantidad de ese bien almacenada.
 */
export class ElementoAlmacen implements Entidad {
  public readonly ID: number;

  constructor(public bien: Bien, public cantidad: number) {
    this.ID = bien.ID;
  }

  toJSON(): Record<string, number | string> {
    let bienjson = this.bien.toJSON();
    let bienjsonstring = JSON.stringify(bienjson);
    return {
      ID: this.ID,
      bien: bienjsonstring,
      cantidad: this.cantidad,
    };
  }

};
