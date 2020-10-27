import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const HTTP_OPTIONS = {
    headers: new HttpHeaders({
        'Content-Type':'application/json',
        'Access-Control-Allow-Origin':'*',        
        'Access-Control-Allow-Headers': 'Authorization, accept, Content-Type'        
    })
}

const ENDPOINT_PROVEEDOR = "http://localhost:8080/api/rest/v1/proveedores";

@Injectable({
    providedIn:'root'
})
export class ProveedorService{

    constructor( private http:HttpClient ){}

    findAll(): Observable<any>{
        return this.http.get<any>(ENDPOINT_PROVEEDOR);
    }

}