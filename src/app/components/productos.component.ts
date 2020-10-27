import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Producto } from '../models/producto';
import { ProductoService } from '../services/producto.service';

import swal from 'sweetalert2';
import { Familia } from '../models/familia';
import { Categoria } from '../models/categoria';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-productos',
  templateUrl: '../views/productos.component.html'
})
export class ProductosComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<Producto> = new Subject<Producto>();

  productos:Array<Producto>;

  clasificaciones:any[]= ["TV Y AUDIO","CÓMPUTO Y TECNOLOGÍA", "LINEA BLANCA"];
  familias:Familia[];
  categorias:Categoria[];
  datePipe:DatePipe;
  
  constructor( private productoService:ProductoService, datePipe:DatePipe ) { 
    this.datePipe=datePipe;
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  ngAfterViewInit(): void {
        
  }

  ngOnInit(): void {

    this.familias = this.getFamilias();
    this.categorias = this.getCategorias();

    this.dtOptions = {
      responsive:true,
      pagingType: 'full_numbers',
      language : {		        	
          "decimal": "",
          "emptyTable": "No hay productos registrados",
          "info": "Mostrando _START_ hasta _END_ de _TOTAL_ resultados",
          "infoEmpty": "0 productos",
          "infoFiltered": "",
          //"infoFiltered": "(filtered from _MAX_ total entries)",
          "infoPostFix": "",
          "thousands": ",",
          "lengthMenu": "Mostrando _MENU_ resultados",
          "loadingRecords": "Cargando...",
          "processing": "Procesando...",
          "search": "Ingrese un  criterio de búsqueda:",
          "zeroRecords": "No se encontraron registros coincidentes",
          "paginate": {
              "first": "Primero",
              "last": "Ultimo",
              "next": "Siguiente",
              "previous": "Anterior"
          }
      }

    };

    

    this.cargarProductos();

  } // END ngOnInit

  eliminarProducto( producto:Producto ): void{
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar el producto ${producto.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {

      if (result.isConfirmed) {

        this.productoService.delete(producto.id).subscribe(
          response => {

            this.reload();

            swalWithBootstrapButtons.fire(
              'Producto Eliminado!',`Producto ${producto.nombre} eliminado con éxito.`,'success');

            
          },
          error => {
            console.log(error);
          }
        )
      } 

    })

  }

  cargarProductos(){
    this.productoService.findAll().subscribe(
      response => {
        this.productos = response.productos;

        console.log(this.productos);
        this.dtTrigger.next();

        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {

          dtInstance.columns().every( function(){
    
            const that = this;
    
            if( this[0][0] == 2 || this[0][0] == 3 || this[0][0] == 4 ){
    
              $('select', this.footer()).on('change', function(){
                if( that.search() !== this['value'] ){
                  console.log("buscando el text -> " + this['value']);
                  that.search(this['value']).draw();
                }
              });
            } else {
              $('input', this.footer()).on('keyup change', function(e){
                if(that.search() !== this['value']){
                  that.search(this['value']).draw();
                }
              });
            }
    
          });
    
        });
      },
      error => {
        console.log("--------------------------");
        console.log(error);
        console.log("--------------------------");
      }
    )
  }

  reload(): void {
    this.datatableElement.dtInstance.then((dtInstance:DataTables.Api)=> {
      dtInstance.destroy();
      this.cargarProductos();
    });
  }

  detailRows = [];

  detalle( button, productoId ): void{

    this.datatableElement.dtInstance.then((dtInstance:DataTables.Api)=> {

      console.log(button);

      var tr = $(button).closest('tr');
      var row = dtInstance.row( tr );
      var idx = $.inArray( tr.attr('id'), this.detailRows );
   
      if ( row.child.isShown() ) {
          tr.removeClass( 'details' );
          row.child.hide();  
          this.detailRows.splice( idx, 1 );
      }
      else {
          tr.addClass( 'details' );
          row.child( this.buildDetailsProducto( productoId ) ).show();  
          if ( idx === -1 ) {
            this.detailRows.push( tr.attr('id') );
          }
      }
      
    });

  }

  buildDetailsProducto( productoId:number ){  

    let htmlDetails = '';
    let data_producto = this.productos.filter((prod) => prod.id == productoId )[0];

    console.log(data_producto);

    htmlDetails += '<div class="row">';
    htmlDetails += '<div class="col-xs-12 col-md-4">';
    htmlDetails += '<div class="table-responsive">';
    htmlDetails += '<table class="table table-bordered">';
    htmlDetails += '<thead><tr>';
    htmlDetails += '<td>PROVEEDOR</td><td>COSTO</td>';
    htmlDetails += '</tr></thead>';
    htmlDetails += '<tbody>';

    $.each( data_producto.costos, function( i, cost ){

      htmlDetails += '<tr>';
      htmlDetails += '<td>'+cost.proveedor.razonSocial+'</td>';
      htmlDetails += '<td>S/'+cost.costo.toFixed(2)+'</td>';
      htmlDetails += '</tr>';

    });

    htmlDetails += '</tbody></table>';
    htmlDetails += '</div></div></div>';                          

    return htmlDetails;
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
} // END CLASS
