import { Component, OnInit, ɵConsole } from '@angular/core';
import { Categoria } from '../models/categoria';
import { Costo } from '../models/costo';
import { Familia } from '../models/familia';

import { Producto } from '../models/producto';
import { Proveedor } from '../models/proveedor';
import { ProductoService } from '../services/producto.service';
import { ProveedorService } from '../services/proveedor.service';

import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form-producto',
  templateUrl: '../views/form-producto.component.html'
})
export class FormProductoComponent implements OnInit {

  clasificaciones:any[]= ["TV Y AUDIO","CÓMPUTO Y TECNOLOGÍA", "LINEA BLANCA"];
  familias:Familia[];
  categorias:Categoria[];
  producto:Producto = new Producto();   
  contador:number=0;
  costos:Array<Costo>=[];
  proveedores:Array<Proveedor>;
  costo:Costo;
  fechaCreacion=new Date();
  base64textString:string;
  url:any;

  fileGlobal:any;

  binaryString:string;

  constructor(
    private productoService:ProductoService,
    private proveedorService:ProveedorService,
    private datePipe:DatePipe,
    private router:Router,
    private acivatedRouter:ActivatedRoute ) { 
    
  }

  ngOnInit(): void {

    this.cargarProveedores();

    this.acivatedRouter.params.subscribe(
      params => {
        let id = params["id"];

        if( id ){

          this.getProducto(id);

        } else {       
          this.producto.clasificacion = "0";
          this.producto.familia = "0";
          this.producto.categoria = "0";
        }
        
        this.producto.fechaCreacion = this.datePipe.transform(this.fechaCreacion,"yyyy-MM-dd");

      }
    )
   
  } // END ngOnInit

  triggerClick(){
    $('#foto').trigger('click');
  }

  enviarCambios(producto:Producto){
    producto.costos = this.costos;
    this.productoService.update(producto).subscribe(
      response => {
        console.log(response);
        this.router.navigate(['/productos']);

        swal.fire("Éxito", response.mensaje, 'success');
      },
      error => {
        console.log("------------------------");
        console.log(error);
        console.log("------------------------");
      }
    );
  }

  guardarCambios(): void {
    let reader = new FileReader();
    if( this.fileGlobal ){
      reader.readAsBinaryString(this.fileGlobal);
      reader.onload = (event:any) => {        
        let binaryString = event.target.result;
        this.base64textString = btoa(binaryString);
        this.producto.foto=this.base64textString;
        this.producto.cambioFoto=true;  
        this.enviarCambios(this.producto);
      };
    } else {
      this.enviarCambios(this.producto);
    }
  }


  getProducto( id:number ){
    this.productoService.findById(id).subscribe(
      response => {

        this.onSelectClasificacion( response.producto.clasificacion );
        this.onSelectFamilia(response.producto.familia);

        this.producto = response.producto;
        if( this.validateImageProducto(this.producto.imageType, this.producto.foto) ){
          this.url = `data:image/${this.producto.imageType};base64,${this.producto.foto}`;
        }
        this.cargarCostos(this.producto.costos);

        console.log(this.producto);

      },
      error => {
        console.log("-----------------------");
        console.log(error);
        console.log("-----------------------");
      }
    )
  }

  onSelectClasificacion( clasificacion:string ):void {
    this.familias = this.getFamilias().filter( (familia) => familia.clasificacion == clasificacion );    
    this.producto.familia = this.familias.length == 0 ? "0" : "0";
    this.onSelectFamilia("0");
  }
  onSelectFamilia( familia:string ):void {
    this.categorias = this.getCategorias().filter( (categoria) => categoria.familia == familia );
    this.producto.categoria = this.categorias.length == 0 ? "0" : "0";
  }

  enviar(): void{        
    this.producto.costos = this.costos;
    this.convertBase64AndSaveProducto(this.fileGlobal, this.producto );
  }
  
  saveProducto(producto:Producto): void{
    
    console.log("enviando producto request");
    console.log(this.producto);    

    this.productoService.save(producto).subscribe(
      response =>{
        console.log(response);

        this.router.navigate(['/productos']);

        swal.fire("Éxito", response.mensaje, 'success');

      },
      error => {
        console.log("Ha ocurrido un error");
        console.log(error);
      }
    );
  }

  cargarProveedores(){
    this.proveedorService.findAll().subscribe(
      response => {
        this.proveedores = response.proveedores;
      },
      error => {
        console.log("-----------------------");
        console.log(error);
        console.log("-----------------------");
      }
    )
  }

  addRowCosto() {
    this.costo = new Costo( new Proveedor(0,""));
    this.costo.contador = this.contador;
    this.costos.push( this.costo );
    this.contador++;
    return true;
  }

  deleteRowCosto(index) {
    this.costos.splice(index, 1);
    return true; 
  }

  getFamilias(){
    return [
      new Familia("TELEVISORES", "TV Y AUDIO"),
      new Familia("CINE EN CASA", "TV Y AUDIO"),
      new Familia("ACCESORIOS", "TV Y AUDIO"),
      new Familia("AUDIO", "TV Y AUDIO"),
      new Familia("COMPUTADORAS", "CÓMPUTO Y TECNOLOGÍA"),
      new Familia("IMPRESORAS Y TINTAS", "CÓMPUTO Y TECNOLOGÍA"),
      new Familia("CELULARES Y TELEFONOS", "CÓMPUTO Y TECNOLOGÍA"),
      new Familia("CALCULADORAS", "CÓMPUTO Y TECNOLOGÍA")
    ]
  }

  getCategorias(){
    return [
      new Categoria("4k Ultra HD","TELEVISORES"),
      new Categoria("Full HD","TELEVISORES"),
      new Categoria("NanoCell","TELEVISORES"),
      new Categoria("Smart TV","TELEVISORES"),
      new Categoria("Laptops","COMPUTADORAS"),
      new Categoria("Laptops Gamer","COMPUTADORAS"),
      new Categoria("Tablets","COMPUTADORAS")
    ];
  }

  cargarCostos( costos:Array<Costo>){

    const that = this;

    $.each( costos, function(i, c ){
      c.contador = that.contador;
      that.contador++;
    });

    this.costos = costos;
  }


  showOrHideInputFechaVencimiento(isPerecedor:boolean): void{
    if( isPerecedor ){
      this.producto.perecedor = isPerecedor;
    } else {
      this.producto.perecedor = isPerecedor;
    }
  }

  handleFileSelect(evt){
    var files = evt.target.files;
    let file = files[0];
    this.fileGlobal = file;    

    if (files && file) {
      if( file.type === "image/jpeg" || file.type === "image/png"){

        if( file.type === "image/jpeg"){
          this.producto.imageType = "jpg"; 
        } else {
          this.producto.imageType = "png";
        }
          
        let sizeMBFile = (file.size/1048576);

        if( sizeMBFile < 2.0 ){

          let reader = new FileReader();

          reader.readAsDataURL(file); 
  
          reader.onload = (event:any) => {
            this.url = event.target.result;
          }                 

        } else {

          swal.fire("Aviso","El tamaño de la imagen es muy grande","warning");

          $("#foto").val("");          
        }
          
      } else {

        swal.fire("Aviso","Solo se permite cargar imagenes con extensión .png o .jpg","warning");
  
        $("#foto").val("");
      }
    }     
  }

  validateImageProducto( tipoImage:string, datos:string ): boolean{
    if( !datos || datos.length === 0 ){
      return false;
    }
    if( !tipoImage || tipoImage.length === 0 || tipoImage !== "png" && tipoImage !== "jpg" ){
      return false;
    }
    return true;
  }

  convertBase64AndSaveProducto( file, producto:Producto ) {
    let reader = new FileReader();

    if( file ){
      reader.readAsBinaryString(file);

      reader.onload = (event:any) => {      
  
        let binaryString = event.target.result;
        this.base64textString = btoa(binaryString);
        this.producto.foto=this.base64textString;
        this.producto.cambioFoto=true;
  
        this.saveProducto(producto);
      };
    } else {
      this.saveProducto(producto);
    }
    
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  convertBase64AndGuardarCambios( file, producto:Producto ){
    
  }



}
