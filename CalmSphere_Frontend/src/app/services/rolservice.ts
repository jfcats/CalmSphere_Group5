import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { Rol } from '../models/rol';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Rolservice {
  private url = `${base_url}/roles`;
  private listaCambio = new Subject<Rol[]>();

  constructor(private http: HttpClient) {}

  list(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.url);
  }

  insert(r: Rol) {
    return this.http.post(this.url, r, { responseType: 'text' });
  }
  
  // === NUEVO: Asignación Masiva ===
  assignRoles(data: any) {
    return this.http.post(`${this.url}/asignar`, data);
  }

  update(r: Rol) {
    return this.http.put(this.url, r, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  listId(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.url}/${id}`);
  }

  search(tipo: string) {
    const params = { n: tipo };
    return this.http.get<Rol[]>(`${this.url}/busquedas`, { params });
  }

  setList(listaNueva: Rol[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
}