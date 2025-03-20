import Transaccion from "../Entidades/Transaccion.js";
import Gestor from "./Gestor.js";

import inquirer from "inquirer";

export default class GestorTransacciones extends Gestor<Transaccion>{

    protected _almacenMap = new Map<number, Transaccion>();
    private static GestorInstancia?: GestorTransacciones;
  
    private constructor(_transaccionesArray: Transaccion[]) {
      if (_transaccionesArray.length === 1 && _transaccionesArray[0].ID === -1) {
        super("BaseDeDatos/transaccions.json");
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
              ),
            ),
          );
        }
      } else {
        super("BaseDeDatos/Dummytransaccions.json");
        this.database.data = _transaccionesArray;
        this.database.write();
        _transaccionesArray.forEach(transaccion => this._almacenMap.set(transaccion.ID, transaccion));
      }
    }
  
    public static getGestorInstancia(_transaccionsArray: Transaccion[] = [new Transaccion(-1)]): GestorTransacciones {
      if (!GestorTransacciones.GestorInstancia) {
          GestorTransacciones.GestorInstancia = new GestorTransacciones(_transaccionsArray);
      }
      return GestorTransacciones.GestorInstancia;
    }
  
    static resetInstance():void {
      GestorTransacciones.GestorInstancia = undefined;
    }
  
    public crear(): void {
      inquirer
        .prompt([
          {
            type: 'input',
            name: '_ID',
            message: 'Ingrese el ID del transaccion:',
            validate(value) {
              const id = Number(value);
              if (isNaN(id)) {
                return 'El ID debe ser un número';
              }
              return true;
            }
          },
        ])
        .then((answers) => {
          const transaccion = new Transaccion(
            parseInt(answers._ID), // Convertimos el ID a número
          );
    
          try {
            this.add(transaccion);
            console.log('transaccion creado y añadido exitosamente');
          } catch (error: unknown) {
            if (error instanceof Error) {
              console.error(error.message); // Si el ID ya está en uso, mostramos el error
            } else {
              console.error('Ha ocurrido un error desconocido');
            }
          }
        });
    }
  
  }