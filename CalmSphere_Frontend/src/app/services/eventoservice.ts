import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { Evento } from '../models/evento';
import { HttpClient } from '@angular/common/http';

// Interface para mapear la respuesta del reporte
export interface ReporteDTO {
  nombre: string;
  cantidad: number;
}

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Eventoservice {
  private url = `${base_url}/eventos`;
  private listaCambio = new Subject<Evento[]>();

  constructor(private http: HttpClient) {}

  // === MÉTODOS CRUD EXISTENTES ===
  list() {
    return this.http.get<Evento[]>(this.url);
  }

  insert(e: Evento) {
    return this.http.post(this.url, this.toDTO(e), { responseType: 'text' });
  }

  update(e: Evento) {
    return this.http.put(`${this.url}`, this.toDTO(e), { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  listId(id: number) {
    return this.http.get<Evento>(`${this.url}/${id}`);
  }

  // === MÉTODOS DE REPORTES (NUEVOS) ===
  
  getReporteProfesional(): Observable<ReporteDTO[]> {
    return this.http.get<ReporteDTO[]>(`${this.url}/reporte-profesional`);
  }

  getReportePagos(): Observable<ReporteDTO[]> {
    return this.http.get<ReporteDTO[]>(`${this.url}/reporte-pagos`);
  }

  // === BÚSQUEDAS ===
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

  // === HELPERS ===
  setList(listaNueva: Evento[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

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