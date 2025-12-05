import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { MetodoPago } from '../models/metodopago';
import { HttpClient } from '@angular/common/http';


const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Metodopagoservice {
  
  private url = `${base_url}/metodopago`;

  private listaCambio = new Subject<MetodoPago[]>();

  constructor(private http: HttpClient) {}

  list(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(this.url);
  }

  // CORREGIDO: Agregado { responseType: 'text' }
  insert(m: MetodoPago) {
    return this.http.post(this.url, m, { responseType: 'text' }); // <--- CORREGIR
  }

  update(m: MetodoPago) {
    return this.http.put(this.url, m, { responseType: 'text' }); // <--- CORREGIR
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); // <--- CORREGIR
  }

  listId(id: number): Observable<MetodoPago> {
    return this.http.get<MetodoPago>(`${this.url}/${id}`);
  }

  setList(listaNueva: MetodoPago[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
}