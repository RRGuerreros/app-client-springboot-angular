import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormProductoComponent } from './components/form-producto.component';
import { ProductosComponent } from './components/productos.component';

const routes: Routes = [
    { path: '', redirectTo: '/productos', pathMatch: 'full' },
    { path: 'productos', component: ProductosComponent },
    { path: 'productos/form', component: FormProductoComponent },
    { path: 'productos/form/:id', component: FormProductoComponent }
]


@NgModule({
    imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}