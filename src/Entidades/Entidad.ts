export interface Entidad {
    readonly ID:number;
    nombre: string;
    toJSON(): Record<string, unknown>;
  }