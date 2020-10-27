import { Proveedor } from './proveedor';

export class Costo{
    id:number;
    proveedor:Proveedor;
    costo:number;
    contador:number;

    constructor( provedor:Proveedor ){
        this.proveedor =provedor;
    }
}