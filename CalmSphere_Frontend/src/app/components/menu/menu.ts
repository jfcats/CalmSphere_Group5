import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { Loginservice } from '../../services/loginservice';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatIconModule, MatToolbarModule, MatMenuModule, MatButtonModule, RouterLink, CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {

  roles: string[] = []; 

  constructor(private loginService: Loginservice) {}

  ngOnInit(): void {
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

  // Comprobaciones seguras con .includes()
  isAdmin() {
    return this.roles.includes('ADMIN'); 
  }

  isProfesional() {
    return this.roles.includes('PROFESIONAL');
  }

  isPaciente() {
    return this.roles.includes('PACIENTE');
  }
}