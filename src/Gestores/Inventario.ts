import Bien from "../Entidades/Bien.js";
import Gestor from "./Gestor.js";

import inquirer from "inquirer";
import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";

/**
 * Clase que representa el inventario de la `Posada del Lobo Blanco`.
 * Contiene un mapa de bienes, clientes y mercaderes.
 * Los datos se almacenan en un fichero JSON.
 * Entre sus funciones están:
 *  - Añadir un cliente, mercader o bien.
 *  - Eliminar un cliente, mercader o bien.
 *  - Consultar información de bienes específicos.
 *  - Localizar mercaderes y clientes por su nombre, tipo, raza o ubicación.
 *  - Llevar el control automatizado del stock, gestionando la cantidad de bienes disponibles.
 *  - Registrar transacciones, como ventas, compras o devoluciones.
 *  - Generar informes con estado del stock, bienes más vendidos y más demandados, total de ingresos y gastos, etc.
 */
export default class Inventario extends Gestor<Bien> {

  protected _almacenMap = new Map<number, Bien>();
  private static GestorInstancia?: Inventario;

  private constructor(_bienesArray: Bien[]) {
    if (
      _bienesArray.length === 1 && _bienesArray[0].nombre === "dummy") {
        super("BaseDeDatos/Inventario.json");

      if (this.database.data == null) {
        console.log(
          "No se ha detectado ningún dato en el fichero json. Esto no debería ocurrir",
        );
      } else {
        this.database.data.forEach((bien) =>
          this._almacenMap.set(
            bien.ID,
            new Bien(
              bien.ID,
              bien.nombre,
              bien.descripcion,
              bien.material,
              bien.peso,
              bien.precio,
              bien.cantidad,
            ),
          ),
        );
      }

    } else {
      super("BaseDeDatos/DummyInventario.json");
      this.database.data = _bienesArray;
      this.database.write();
      _bienesArray.forEach(cliente => this._almacenMap.set(cliente.ID, cliente));
    }
  }

    public static getGestorInstancia(_bienesArray: Bien[] = [new Bien(-1,"dummy", "Bien dummy", "vacio", 0, 0, 0)]): Inventario {
        if (!Inventario.GestorInstancia) {
            Inventario.GestorInstancia = new Inventario(_bienesArray);
        }
        return Inventario.GestorInstancia;
    }

    static resetInstance():void {
        Inventario.GestorInstancia = undefined;
    }


    public crear(): void {
      inquirer
        .prompt([
          {
            type: 'input',
            name: '_ID',
            message: 'Ingrese el ID del bien:',
            validate(value) {
              const id = Number(value);
              if (isNaN(id)) {
                return 'El ID debe ser un número';
              }
              return true;
            }
          },
          {
            type: 'input',
            name: '_nombre',
            message: 'Ingrese el nombre del bien:',
            validate(value) {
              return value.trim() !== '' ? true : 'El nombre no puede estar vacío';
            }
          },
          {
            type: 'input',
            name: '_descripcion',
            message: 'Ingrese la descripción del bien:',
            validate(value) {
              return value.trim() !== '' ? true : 'La descripción no puede estar vacía';
            }
          },
          {
            type: 'input',
            name: '_material',
            message: 'Ingrese el material del bien:',
            validate(value) {
              return value.trim() !== '' ? true : 'El material no puede estar vacío';
            }
          },
          {
            type: 'input',
            name: '_peso',
            message: 'Ingrese el peso del bien (kg):',
            validate(value) {
              const peso = Number(value);
              if (isNaN(peso) || peso <= 0) {
                return 'El peso debe ser un número mayor que 0';
              }
              return true;
            }
          },
          {
            type: 'input',
            name: '_precio',
            message: 'Ingrese el precio del bien:',
            validate(value) {
              const precio = Number(value);
              if (isNaN(precio) || precio < 0) {
                return 'El precio debe ser un número positivo';
              }
              return true;
            }
          },
          {
            type: 'input',
            name: '_cantidad',
            message: 'Ingrese la cantidad del bien:',
            validate(value) {
              const cantidad = Number(value);
              if (isNaN(cantidad) || cantidad < 0) {
                return 'La cantidad debe ser un número positivo';
              }
              return true;
            }
          },
        ])
        .then((answers) => {
          const bien = new Bien(
            parseInt(answers._ID), // Convertimos el ID a número
            answers._nombre,
            answers._descripcion,
            answers._material,
            parseFloat(answers._peso), // Convertimos peso a número
            parseFloat(answers._precio), // Convertimos precio a número
            parseInt(answers._cantidad) // Convertimos cantidad a número
          );
  
          try {
            this.add(bien);
            console.log('Bien creado y añadido exitosamente');
          } catch (error: unknown) {
            if (error instanceof Error) {
              console.error(error.message); // Si el ID ya está en uso, mostramos el error
            } else {
              console.error('Ha ocurrido un error desconocido');
            }
          }
        });
    }

  // TODO: Implementar funciones para consultar información de bienes específicos (ordenación).
  // TODO: Implementar funcion para localizar mercaderes y clientes por su nombre, tipo, raza o ubicación.
  
  /*REVISAR
  venderBien(bien: Bien, cantidad: number, fecha: Date) {
    if (!this.almacenMap.has(bien.ID)) {
      throw new Error(`Bien con ID ${bien.ID} no encontrado.`);
    }
    const bienExistente = this.almacenMap.get(bien.ID);
    if (bienExistente === undefined || bienExistente.cantidad < cantidad) {
      throw new Error(
        `No hay suficientes ${bien.nombre} en stock. Stock actual: ${bien.cantidad}`,
      );
    }
    bienExistente.removeBien(bien.ID);
    this.storeInventario();
  }
  */
}
