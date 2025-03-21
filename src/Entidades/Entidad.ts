/**
 * Interfaz que define el comportamiento de una entidad.
 * Las entidades deben tener un ID y un método toJSON.
 */
export interface Entidad {
  readonly ID: number;
  toJSON(): Record<string, unknown>;
}
