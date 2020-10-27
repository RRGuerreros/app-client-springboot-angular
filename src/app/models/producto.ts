import { Costo } from './costo';

export class Producto{

    id:number;
    nombre:string;
    marca:string;
    clasificacion:string;
    familia:string;
    categoria:string;
    stockInicial:number;
    fechaCreacion:string;
    stockMinimo:number;
    costos:Array<Costo>;
    perecedor:boolean=false;
    venta:boolean=false;
    compra:boolean=false;
    obsequio:boolean=false;
    fechaVencimiento:string=null;
    comentario:string;
    foto:string;
    imageType:string;
    cambioFoto:boolean;

}