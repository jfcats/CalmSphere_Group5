import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { Evento } from '../models/evento';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Eventoservice {
private url = `${base_url}/eventos`;

  private listaCambio = new Subject<Evento[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Evento[]>(this.url);
  }

  insert(e: Evento) {
    return this.http.post(this.url, this.toDTO(e));
  }

  setList(listaNueva: Evento[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Evento>(`${this.url}/${id}`);
  }

  update(e: Evento) {
    return this.http.put(`${this.url}`, this.toDTO(e), { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  // búsquedas
  searchByUsuario(idUsuario: number): Observable<Evento[]> {
    const params = { idUsuario: idUsuario.toString() };
    return this.http.get<Evento[]>(`${this.url}/busquedas/usuario`, { params });
  }

  searchByProfesional(idProfesionalServicio: number): Observable<Evento[]> {
    const params = { idProfesionalServicio: idProfesionalServicio.toString() };
    return this.http.get<Evento[]>(`${this.url}/busquedas/profesional`, { params });
  }

  searchByMetodoPago(idMetodoPago: number): Observable<Evento[]> {
    const params = { idMetodoPago: idMetodoPago.toString() };
    return this.http.get<Evento[]>(`${this.url}/busquedas/metodo-pago`, { params });
  }

  // mapea a EventoDTOInsert que espera el backend
  private toDTO(e: Evento): any {
    return {
      idEvento: e.idEvento,
      idUsuario: { idUsuario: e.idUsuario },
      idProfesionalServicio: { idProfesionalServicio: e.idProfesionalServicio },
      idMetodoPago: { idMetodoPago: e.idMetodoPago },
      inicio: e.inicio,
      fin: e.fin,
      estado: e.estado,
      motivo: e.motivo,
      monto: e.monto,
    };
  }
}