import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtRequest } from '../models/jwtRequest';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class Loginservice {

  constructor(private http: HttpClient) { }

  login(request: JwtRequest) {
    return this.http.post('http://localhost:8080/login', request); // Asegúrate que el puerto sea el correcto
  }

  verificar() {
    if (typeof window === 'undefined') return false; 
    let token = sessionStorage.getItem("token");
    return token != null;
  }

  showRole(): string[] {
    if (typeof window === 'undefined') return [];
    let token = sessionStorage.getItem("token");
    if (!token) return [];
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    const rawRole = decodedToken?.role;
    if (!rawRole) return [];
    const rolesDetectados: string[] = [];
    const rolesPosibles = ['ADMIN', 'PACIENTE', 'PROFESIONAL'];
    const rolString = rawRole.toString().toUpperCase();
    rolesPosibles.forEach(rol => {
      if (rolString.includes(rol)) {
        rolesDetectados.push(rol);
      }
    });
    return rolesDetectados;
  }

  // === AGREGA ESTO ===
  getUsername(): string {
    if (typeof window === 'undefined') return '';
    let token = sessionStorage.getItem("token");
    if (!token) return '';
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    // 'sub' es el estándar para el username/email en JWT
    return decodedToken?.sub || ''; 
  }
}