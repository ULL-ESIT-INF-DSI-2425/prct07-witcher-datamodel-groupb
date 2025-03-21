import Bien from "../Entidades/Bien.js";

/**
 * Interfaz que representa un elemento almacenado en el inventario.
 * Contiene un bien y la cantidad de ese bien almacenada.
 */
export type ElementoAlmacen = {
  bien: Bien;
  cantidad: number;
};
