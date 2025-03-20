export interface Entidad {
    readonly ID:number;
    toJSON(): Record<string, unknown>;
  }