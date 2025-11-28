import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { Disponibilidad } from '../models/disponibilidad';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // <--- Importar HttpHeaders

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Disponibilidadservice {
  private url = `${base_url}/disponibilidades`;
  private listaCambio = new Subject<Disponibilidad[]>();

  constructor(private http: HttpClient) {}

  // Función auxiliar para obtener el header con el token
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  list(): Observable<Disponibilidad[]> {
    // Le pasamos el header explícitamente
    return this.http.get<Disponibilidad[]>(this.url, { headers: this.getHeaders() });
  }

  insert(d: Disponibilidad) {
    // También aquí
    return this.http.post(this.url, d, { 
      headers: this.getHeaders(),
      responseType: 'text' 
    });
  }

  update(d: Disponibilidad) {
    return this.http.put(this.url, d, { 
      headers: this.getHeaders(),
      responseType: 'text' 
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { 
      headers: this.getHeaders(),
      responseType: 'text' 
    });
  }

  listId(id: number): Observable<Disponibilidad> {
    return this.http.get<Disponibilidad>(`${this.url}/${id}`, { headers: this.getHeaders() });
  }

  // búsqueda por día de semana
  searchByDiaSemana(dia: number) {
    const params = { d: dia };
    return this.http.get<Disponibilidad[]>(`${this.url}/busquedas`, { 
      params, 
      headers: this.getHeaders() 
    });
  }

  setList(listaNueva: Disponibilidad[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
}