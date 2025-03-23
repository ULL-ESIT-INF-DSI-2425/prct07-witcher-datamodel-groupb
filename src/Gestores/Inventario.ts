import Bien from "../Entidades/Bien.js";
import Gestor from "./Gestor.js";
import ElementoAlmacen from "../Entidades/ElementoAlmacen.js";

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

  private constructor(elementosArray: ElementoAlmacen[]) {
    if (
      elementosArray.length === 1 &&
      elementosArray[0].bien.nombre === "dummy"
    ) {
      // Si el bien es dummy, se carga el fichero JSON
      super("BaseDeDatos/Inventario.json");
      // Si no hay datos en el fichero, se crea un bien dummy
      if (this.database.data == null) {
        this.imprimirMensajeError();
      } else {
        // Si hay datos, se cargan
        // Limpiamos el mapa para asegurarnos de cargar TODOS los elementos del JSON
        this._almacenMap.clear();
        this.database.data.forEach((elemento) =>
          this._almacenMap.set(
            elemento.ID,
            new ElementoAlmacen(elemento.bien, elemento.cantidad),
          ),
        );
      }
    } else {
      // Si no es dummy, se crea un bien dummy y se añaden los elementos
      super("BaseDeDatos/DummyInventario.json");
      // Es lo mismo que `this.storeInventario();` pero sin el dummy
      this.database.data = elementosArray;
      this.database.write();
      // Limpiamos el mapa para asegurarnos de cargar TODOS los elementos del JSON
      elementosArray.forEach((elemento) =>
        this._almacenMap.set(elemento.ID, elemento),
      );
    }
  }

  /**
   * Método para imprimir un mensaje de error por pantalla.
   * Se hace de esta forma para poder hacer bien los tests.
   * @returns void
   */
  public imprimirMensajeError(): void {
    console.log(
      "No se ha detectado ningún dato en el fichero json. Esto no debería ocurrir",
    );
  }

  /**
   * Método que añade un elemento al inventario.
   * Si el elemento ya existe, se suma la cantidad.
   * @param elemento - Elemento a añadir.
   */
  add(elemento: ElementoAlmacen): void {
    if (elemento.cantidad <= 0) {
      throw new Error("La cantidad debe ser mayor que 0");
    }
    if (this._almacenMap.has(elemento.ID)) {
      // Si ya existe, se suma la cantidad
      this.get(elemento.ID).cantidad += elemento.cantidad;
    } else {
      // Si no existe, se añade
      this._almacenMap.set(elemento.ID, elemento);
    }
    this.storeInventario();
  }
  

  /**
   * Getter de la propiedad `almacenMap` que devuelve el inventario.
   * @returns Map - Mapa con los elementos almacenados.
   */
  public static getGestorInstancia(
    elementosArray: ElementoAlmacen[] = [
      new ElementoAlmacen(
        new Bien(-1, "dummy", "Bien dummy", "vacio", 0, 0),
        1,
      ),
    ],
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
