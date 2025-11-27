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
    return this.http.post('http://localhost:8080/login', request);
  }

  verificar() {
    if (typeof window === 'undefined') return false; 
    let token = sessionStorage.getItem("token");
    return token != null;
  }

  // MODIFICADO: Ahora devuelve un arreglo de strings (string[])
  showRole(): string[] {
    if (typeof window === 'undefined') return [];
    
    let token = sessionStorage.getItem("token");
    if (!token) return [];

    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    const roleClaim = decodedToken?.role; // O 'authorities', depende de tu back

    // Caso 1: No hay rol
    if (!roleClaim) return [];

    // Caso 2: Es un arreglo (Ej: ["ADMIN", "PACIENTE"])
    if (Array.isArray(roleClaim)) {
      return roleClaim;
    }

    // Caso 3: Es un string simple (Ej: "ADMIN")
    // Lo convertimos a arreglo para mantener la consistencia
    return [roleClaim];
  }
}