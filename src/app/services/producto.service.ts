import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';


const HTTP_OPTIONS = {
  headers: new HttpHeaders({
      'Content-Type':'application/json',
      'Access-Control-Allow-Origin':'*',        
      'Access-Control-Allow-Headers': 'Authorization, accept, Content-Type'        
  })
}

const ENDPOINT_PRODUCTO = "http://localhost:8080/api/rest/v1/productos";

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor( private http:HttpClient ) { }

  save( producto:Producto): Observable<any>{
    return this.http.post<any>(ENDPOINT_PRODUCTO, producto, HTTP_OPTIONS);
  }

  findAll(): Observable<any>{
    return this.http.get<any>(ENDPOINT_PRODUCTO);
  }

  findById(id:number): Observable<any>{
    return this.http.get<any>(`${ENDPOINT_PRODUCTO}/${id}`);
  }

  update( producto:Producto ): Observable<any>{
    return this.http.put<any>(ENDPOINT_PRODUCTO, producto, HTTP_OPTIONS);
  }

  delete( id:number ): Observable<any>{
    return this.http.delete<any>(`${ENDPOINT_PRODUCTO}/${id}`);
  }

  
}
