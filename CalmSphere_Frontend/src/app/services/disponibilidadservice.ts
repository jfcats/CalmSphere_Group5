import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { Disponibilidad } from '../models/disponibilidad';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Disponibilidadservice {
  private url = `${base_url}/disponibilidades`;

  private listaCambio = new Subject<Disponibilidad[]>();

  constructor(private http: HttpClient) {}

  list(): Observable<Disponibilidad[]> {
    return this.http.get<Disponibilidad[]>(this.url);
  }

  // CORREGIDO: Agregado { responseType: 'text' }
  insert(d: Disponibilidad) {
    return this.http.post(this.url, d, { responseType: 'text' });
  }

  update(d: Disponibilidad) {
    return this.http.put(this.url, d, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  listId(id: number): Observable<Disponibilidad> {
    return this.http.get<Disponibilidad>(`${this.url}/${id}`);
  }

  // búsqueda por día de semana (parámetro d)
  searchByDiaSemana(dia: number) {
    const params = { d: dia };
    return this.http.get<Disponibilidad[]>(`${this.url}/busquedas`, { params });
  }

  setList(listaNueva: Disponibilidad[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
}