import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// IMPORT COMPONENT
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProductosComponent } from './components/productos.component';
import { FooterComponent } from './footer/footer.component';

// IMPORT MODULE
import { AppRoutingModule } from './app-routing.module'; // NUESTRAS RUTAS MAPEADAS
import { RouterModule } from '@angular/router'; // PARA CONFIGURAR LAS RUTAS DE LA APP
import { HttpClientModule } from '@angular/common/http';
import { FormProductoComponent } from './components/form-producto.component';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

// IMPORT SERVICES
import { ProductoService } from './services/producto.service';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    ProductosComponent,
    FormProductoComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    DataTablesModule
  ],
  providers: [
    ProductoService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
