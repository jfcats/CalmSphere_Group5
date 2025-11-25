import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { Loginservice } from '../../services/loginservice';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatIconModule, MatToolbarModule, MatMenuModule, MatButtonModule, RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {

  role: string = '';

  constructor(private loginService: Loginservice) {}

  verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }

  cerrar() {
    sessionStorage.clear();
  }

  // ===== EXACTAMENTE COMO LA PROFESORA =====
  isAdmin() {
    return this.role === 'ADMIN';
  }

  isProfesional() {
    return this.role === 'PROFESIONAL';
  }

  isPaciente() {
    return this.role === 'PACIENTE';
  }
}