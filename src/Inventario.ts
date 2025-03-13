import Bien  from "./Bien.js"
import Cliente from "./Cliente.js"
import Mercader from "./Mercader.js"

import { LowSync } from "lowdb";
import { JSONFileSync  } from "lowdb/node";


type schemaType = {
    bienes: { ID: number, nombre: string, descripcion: string, material: string, peso: number, precio: number, cantidad:number}[]
    clientes: { ID: number, nombre: string, raza: string, ubicacion: string}[]
    mercaderes: { ID: number, nombre: string, tipo: string, ubicacion: string}[]
};


export default class Inventario{
    private database: LowSync<schemaType>;

    private bienesMap = new Map<number, Bien>
    private clientesMap = new Map<number, Cliente>
    private mercaderesMap = new Map<number, Mercader>


    constructor() {
        this.database = new LowSync(new JSONFileSync("BaseDeDatos/Inventario.json"));
        this.database.read();
 
        if (this.database.data == null) {
            console.log("No se ha detectado ningún dato en el fichero json. Esto no debería ocurrir");

        } else {
            this.database.data.clientes.forEach(cliente => 
                this.clientesMap.set(cliente.ID, 
                    new Cliente(cliente.ID, cliente.nombre, cliente.raza, cliente.ubicacion)));
            
            this.database.data.mercaderes.forEach(mercader => 
                this.mercaderesMap.set(mercader.ID, 
                    new Mercader(mercader.ID, mercader.nombre, mercader.tipo, mercader.ubicacion)));
        }
    }

    getclientesMap(){
        return this.clientesMap;
    }
    getmercaderesMap(){
        return this.mercaderesMap;
    }
    getbienesMap(){
        return this.bienesMap;
    }

}