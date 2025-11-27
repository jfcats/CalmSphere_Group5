import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Menu } from '../menu/menu'; // Asegúrate de que la ruta sea correcta
import { Loginservice } from '../../services/loginservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Menu, RouterOutlet, CommonModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout implements OnInit {
  
  // AHORA ES UN ARRAY PARA SOPORTAR MULTI-ROL
  roles: string[] = []; 

  constructor(private lS: Loginservice, private router: Router) {}

  ngOnInit(): void {
    // showRole() ahora devuelve string[] según el cambio en el servicio
    this.roles = this.lS.showRole(); 
  }

  // Lógica para mostrar el Dashboard SOLO si estamos en '/inicio'
  showDashboard(): boolean {
    return this.router.url === '/inicio';
  }

  // VALIDACIONES MULTI-ROL (USANDO INCLUDES)
  isAdmin() { 
    return this.roles.includes('ADMIN'); 
  }

  isPaciente() { 
    return this.roles.includes('PACIENTE'); 
  }

  isProfesional() { 
    return this.roles.includes('PROFESIONAL'); 
  }
}