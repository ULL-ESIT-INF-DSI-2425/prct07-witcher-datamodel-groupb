import Mercader from "../Entidades/Mercader.js";
import Gestor from "./Gestor.js";

/**
 * Clase que representa el inventario de la `Posada del Lobo Blanco`.
 * Contiene un mapa de bienes, mercaders y mercaderes.
 * Los datos se almacenan en un fichero JSON.
 * Entre sus funciones están:
 *  - Añadir un mercader, mercader o bien.
 *  - Eliminar un mercader, mercader o bien.
 *  - Consultar información de bienes específicos.
 *  - Localizar mercaderes y mercaders por su nombre, tipo, raza o ubicación.
 *  - Llevar el control automatizado del stock, gestionando la cantidad de bienes disponibles.
 *  - Registrar transacciones, como ventas, compras o devoluciones.
 *  - Generar informes con estado del stock, bienes más vendidos y más demandados, total de ingresos y gastos, etc.
 */
export default class GestorMercaderes extends Gestor<Mercader> {
  protected _almacenMap = new Map<number, Mercader>();
  private static GestorInstancia?: GestorMercaderes;

  private constructor(mercaderesArray: Mercader[]) {
    if (
      mercaderesArray.length === 1 &&
      mercaderesArray[0].nombre === "dummy"
    ) {
      super("BaseDeDatos/Mercaderes.json");

      if (this.database.data == null) {
        console.log(
          "No se ha detectado ningún dato en el fichero json. Esto no debería ocurrir",
        );
      } else {
        this.database.data.forEach((mercader) =>
          this._almacenMap.set(
            mercader.ID,
            new Mercader(
              mercader.ID,
              mercader.nombre,
              mercader.tipo,
              mercader.ubicacion,
            ),
          ),
        );
      }
    } else {
      super("BaseDeDatos/DummyMercaderes.json");
      this.database.data = mercaderesArray;
      this.database.write();
      mercaderesArray.forEach((mercader) =>
        this._almacenMap.set(mercader.ID, mercader),
      );
    }
  }

  public static getGestorInstancia(
    _mercaderesArray: Mercader[] = [
      new Mercader(-1, "dummy", "mercader dummy", "tests"),
    ],
  ): GestorMercaderes {
    if (!GestorMercaderes.GestorInstancia) {
      GestorMercaderes.GestorInstancia = new GestorMercaderes(_mercaderesArray);
    }
    return GestorMercaderes.GestorInstancia;
  }

  static resetInstance(): void {
    GestorMercaderes.GestorInstancia = undefined;
  }

}
