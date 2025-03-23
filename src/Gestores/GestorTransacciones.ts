import Bien from "../Entidades/Bien.js";
import Cliente from "../Entidades/Cliente.js";
import ElementoAlmacen from "../Entidades/ElementoAlmacen.js";
import Mercader from "../Entidades/Mercader.js";
import Transaccion from "../Entidades/Transaccion.js";
import Gestor from "./Gestor.js";
import inquirer from "inquirer";

/**
 * Clase que gestiona las transacciones realizadas en la `Posada del Lobo Blanco`.
 * Extiende de la clase `Gestor`. Contiene un mapa de transacciones.
 * Los datos se almacenan en un fichero JSON.
 * Entre sus funciones están:
 *  - Crear una transacción.
 *  - Añadir una transacción.
 *  - Eliminar una transacción.
 *  - Consultar las ventas.
 *  - Consultar las compras.
 *  - Consultar las devoluciones.
 */
export default class GestorTransacciones extends Gestor<Transaccion> {
  protected _almacenMap = new Map<number, Transaccion>();
  private static GestorInstancia?: GestorTransacciones;

  private constructor(transaccionesArray: Transaccion[]) {
    if (transaccionesArray.length === 1 && transaccionesArray[0].ID === -1) {
      super("BaseDeDatos/Transacciones.json");
      if (this.database.data == null) {
        console.log(
          "No se ha detectado ningún dato en el fichero json. Esto no debería ocurrir",
        );
      } else {
        this.database.data.forEach((transaccion) =>
          this._almacenMap.set(
            transaccion.ID,
            new Transaccion(
              transaccion.ID,
              transaccion.fecha,
              transaccion.bienes,
              transaccion.persona,
              transaccion.devolucion,
            ),
          ),
        );
      }
    } else {
      super("BaseDeDatos/Dummytransacciones.json");
      this.database.data = transaccionesArray;
      this.database.write();
      transaccionesArray.forEach((transaccion) =>
        this._almacenMap.set(transaccion.ID, transaccion),
      );
    }
  }

  /**
   * Sobreescribir a la función de la clase padre para que no se pueda sobreescribir una transacción ya guardada.
   * Prohibido toquetear las cuentas.
   * @param entidad - Transacción a modificar
   */
  update(entidad: Transaccion): void {
    throw new Error("No se pueden modificar las transacciones ya creadas.");
  }

  //Funcion para obtener un ID no usado para una nueva transaccion
  getTransaccionID(): number {
    let newID = 1;
    while (this._almacenMap.has(newID)) {
      newID++;
    }
    return newID;
  }

  /**
   * Función que devuelve los bienes más vendidos
   * Por alguna razón funciona en node pero no en los test
   * @returns Nombre de los bienes más vendidos
   */
  bienesMasVendidos(): string[] {
    let cantidad_venta = new Map<number, number>();
    this._almacenMap.forEach((transaccion) => {
      if (transaccion.persona.hasOwnProperty("raza") && transaccion.devolucion === false) {
        const bienID = transaccion.bienes.ID;
        const bienCantidad = transaccion.bienes.cantidad;
        let cantidad = cantidad_venta.get(bienID) || 0;
        cantidad_venta.set(bienID, cantidad + bienCantidad);
      }
    });

    let mayor_cantidad = 0;
    let bienes_mas_vendidos: number[] = [];
    cantidad_venta.forEach((cantidad, ID) => {
      if (cantidad > mayor_cantidad) {
        mayor_cantidad = cantidad;
        bienes_mas_vendidos = [ID];
      } else if (cantidad === mayor_cantidad) {
        bienes_mas_vendidos.push(ID);
      }
    });
    let result: string[] = [`Cantidad: ${mayor_cantidad}`];
    bienes_mas_vendidos.forEach((ID) => {
      const bien = Bien.fromJSON(this._almacenMap.get(ID)?.bienes.bien);
      result.push(`${bien.ID} - ${bien.nombre}`);
    });
    return result;
  }


  /**
   * Función que suma todas las ventas realizadas y las devoluciones de mercaderes
   * @returns Total de Ingresos
   */
  totalIngresos(): number {
    let total = 0;
    this._almacenMap.forEach((transaccion) => {
      if((transaccion.persona.hasOwnProperty("raza") && transaccion.devolucion === false) ||
        (transaccion.persona.hasOwnProperty("tipo") && transaccion.devolucion === true))
          total += transaccion.bienes.bien.precio * transaccion.bienes.cantidad;
    });
    return total;
  }

  /**
   * Función que suma todas las compras realizadas y las devoluciones a clientes
   * @returns Total de gastos
   */
  totalGastos(): number {
    let total = 0;
    this._almacenMap.forEach((transaccion) => {
      if((transaccion.persona.hasOwnProperty("tipo") && transaccion.devolucion === false) ||
       (transaccion.persona.hasOwnProperty("raza") && transaccion.devolucion === true))
        total += transaccion.bienes.bien.precio * transaccion.bienes.cantidad;
    });
    return total;
  }

  /**
   * Función que devuelve las transacciones de un mercader
   * @returns Array con las transacciones para devolución
   */
  getMercaderes(): string[] {
    let mercaderes: string[] = [];
    this._almacenMap.forEach((transaccion) => {
      const persona = Mercader.fromJSON(transaccion.persona);
      if(transaccion.persona.hasOwnProperty("tipo"))
      if (persona instanceof Mercader) {
        if (!mercaderes.includes(`${persona.ID} - ${persona.nombre}`))
          mercaderes.push(`${persona.ID} - ${persona.nombre}`);
      }
    });
    return mercaderes;
  }

  /**
   * Función que devuelve las transacciones de un cliente
   * @returns Array con las transacciones para devolución
   */
  getClientes(): string[] {
    const clientes: string[] = [];
    this._almacenMap.forEach((transaccion) => {
      const persona = Cliente.fromJSON(transaccion.persona);
      if(transaccion.persona.hasOwnProperty("raza"))
      if (persona instanceof Cliente) {
        if (!clientes.includes(`${persona.ID} - ${persona.nombre}`))
          clientes.push(`${persona.ID} - ${persona.nombre}`)
      }
    });
    return clientes;
  }

  /**
   * Función que devuelve los bienes que una persona dada compró o vendió
   * Para evitar que una persona devuelva algo que no compró él mismo
   * Me falta que no pueda devolver más de lo que compró o vendió.
   * Por ejemplo, si compró 1 espada puede devolver 3
   * @param persona - Cliente o Mercader con el que se interactuó
   * @returns Array con los bienes que la persona compró o vendió
   */
  getBienes(persona:Cliente|Mercader): string[] {
    const bienes: string[] = [];
    this._almacenMap.forEach((transaccion) => {
      if (transaccion.persona.ID === persona.ID)
      if (!bienes.includes(`${transaccion.bienes.ID} - ${transaccion.bienes.bien.nombre}`))
      bienes.push(`${transaccion.bienes.ID} - ${transaccion.bienes.bien.nombre}`);
    });
    return bienes;
  }

  /**
   * Función que devuelve la Instancia del inventario
   * @param _transaccionesArray Array inicial para que los tests usen otra base de datos
   * @returns Instancia de la clase
   */
  public static getGestorInstancia(
    _transaccionesArray: Transaccion[] = [new Transaccion(-1, new Date(), new ElementoAlmacen(new Bien(-1, "Dummy", "dummy", "nada", 0, 0 ),0), 
      new Cliente(-1, "Dummy", "ninguna", "ningun sitio"))],
  ): GestorTransacciones {
    if (!GestorTransacciones.GestorInstancia) {
      GestorTransacciones.GestorInstancia = new GestorTransacciones(
        _transaccionesArray,
      );
    }
    return GestorTransacciones.GestorInstancia;
  }

  /**
   * Función para que los tests puedan borrar su almacenamiento
   */
  static resetInstance(): void {
    GestorTransacciones.GestorInstancia = undefined;
  }
}
