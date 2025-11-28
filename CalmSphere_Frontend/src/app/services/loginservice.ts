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
    // Asegúrate de que esta URL sea la correcta de tu backend
    return this.http.post('http://localhost:8080/login', request);
  }

  verificar() {
    if (typeof window === 'undefined') return false; 
    let token = sessionStorage.getItem("token");
    return token != null;
  }

  // === LA MAGIA ESTÁ AQUÍ ===
  showRole(): string[] {
    if (typeof window === 'undefined') return [];
    
    let token = sessionStorage.getItem("token");
    if (!token) return [];

    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    const rawRole = decodedToken?.role; // Esto llega sucio: "PACIENTEPROFESIONAL"

    if (!rawRole) return [];

    // 1. Definimos los roles que existen en tu sistema
    const rolesDetectados: string[] = [];
    const rolesPosibles = ['ADMIN', 'PACIENTE', 'PROFESIONAL'];

    // 2. Convertimos lo que llega a mayúsculas para comparar bien
    const rolString = rawRole.toString().toUpperCase();

    // 3. Buscamos qué palabras clave están "escondidas" en el texto
    rolesPosibles.forEach(rol => {
      // Si dice "PACIENTEPROFESIONAL", .includes('PACIENTE') dará true
      if (rolString.includes(rol)) {
        rolesDetectados.push(rol);
      }
    });

    return rolesDetectados; // Devuelve ["PACIENTE", "PROFESIONAL"]
  }
}