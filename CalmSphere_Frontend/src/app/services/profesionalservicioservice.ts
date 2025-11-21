import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { ProfesionalServicio } from '../models/profesionalservicio';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Profesionalservicioservice {
   private url = `${base_url}/profesional-servicios`;

  private listaCambio = new Subject<ProfesionalServicio[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<ProfesionalServicio[]>(this.url);
  }

  insert(p: ProfesionalServicio) {
    return this.http.post(this.url, p);
  }

  setList(listaNueva: ProfesionalServicio[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<ProfesionalServicio>(`${this.url}/${id}`);
  }

  update(p: ProfesionalServicio) {
    // tu backend devuelve String en el PUT, igual que en Proveedor
    return this.http.put(`${this.url}`, p, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  // GET /profesional-servicios/busquedas?idUsuario=...
  searchByUsuario(idUsuario: number): Observable<ProfesionalServicio[]> {
    const params = { idUsuario: idUsuario.toString() };
    return this.http.get<ProfesionalServicio[]>(`${this.url}/busquedas`, { params });
  }
}
