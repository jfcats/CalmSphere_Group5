import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Usuarioservice {
  private url = `${base_url}/usuarios`;
  private listaCambio = new Subject<Usuario[]>();

  constructor(private http: HttpClient) {}

  // LISTAR
  list(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }

  // INSERTAR
  // ⚠️ AQUÍ FALTABA EL { responseType: 'text' }
  insert(u: Usuario) {
    return this.http.post(this.url, u, { responseType: 'text' }); 
  }

  // ACTUALIZAR
  update(u: Usuario) {
    return this.http.put(this.url, u, { responseType: 'text' });
  }

  // ELIMINAR
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  // LISTAR POR ID
  listId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  // BUSQUEDA POR NOMBRE
  searchName(nombre: string) {
    const params = { n: nombre };
    return this.http.get<Usuario[]>(`${this.url}/busquedas`, { params });
  }

  // BUSQUEDA EVENTO ESTRES
  searchEventoEstres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/busquedasEventoEstres`);
  }

  // GESTION DE CAMBIO DE LISTA
  setList(listaNueva: Usuario[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listByEmail(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/buscarPorEmail/${email}`);
  }
}