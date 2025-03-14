

export default class Bien{
    constructor(private _ID: number, private _nombre: string, private _descripcion: string, private _material: string, 
        private _peso: number, private _precio: number, private _cantidad: number) {}
    
    get ID(){
        return this._ID;
    }
    get nombre(){
        return this._nombre;
    }
    get descripcion(){
        return this._descripcion;
    }
    get material(){
        return this._material;
    }
    get peso(){
        return this._peso;
    }
    get precio(){
        return this._precio;
    }
    get cantidad(){
        return this._cantidad;
    }
}