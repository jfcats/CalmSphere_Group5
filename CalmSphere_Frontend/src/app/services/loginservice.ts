import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtRequest } from '../models/jwtRequest';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class Loginservice {

  constructor(private http: HttpClient) {}

  login(request: JwtRequest) {
    return this.http.post('http://localhost:8080/login', request);
  }

  verificar() {
    // 👇 Muy importante: en SSR no hay window/sessionStorage
    if (typeof window === 'undefined') {
      return false;
    }

    const token = sessionStorage.getItem('token');
    return token != null;
  }

  showRole() {
    if (typeof window === 'undefined') {
      return null;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      return null;
    }

    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.role; // asume que el back pone "role" en el JWT
  }
}
