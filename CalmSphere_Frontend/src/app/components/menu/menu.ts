import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { Loginservice } from '../../services/loginservice';
import { CommonModule } from '@angular/common'; // Importante para el template

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatIconModule, MatToolbarModule, MatMenuModule, MatButtonModule, RouterLink, CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {

  roles: string[] = []; // Ahora es un array

  constructor(private loginService: Loginservice) {}

  ngOnInit(): void {
      // Cargamos roles al iniciar
      if(this.verificar()){
        this.roles = this.loginService.showRole();
      }
  }

  verificar() {
    return this.loginService.verificar();
  }

  cerrar() {
    sessionStorage.clear();
  }

  // ===== LÓGICA MULTI-ROL (CORREGIDA) =====
  
  isAdmin() {
    // Verifica si 'ADMIN' está dentro de la lista de roles
    return this.roles.includes('ADMIN'); 
  }

  isProfesional() {
    return this.roles.includes('PROFESIONAL');
  }

  isPaciente() {
    return this.roles.includes('PACIENTE');
  }
}