import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Menu } from '../menu/menu'; 
import { Loginservice } from '../../services/loginservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Menu, RouterOutlet, CommonModule, RouterLink], // Importamos RouterLink para el HTML
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout implements OnInit {
  
  roles: string[] = []; 

  constructor(private lS: Loginservice, private router: Router) {}

  ngOnInit(): void {
    this.roles = this.lS.showRole(); 
  }

  // Muestra el Dashboard SOLO si la URL es exacta '/inicio'
  showDashboard(): boolean {
    return this.router.url === '/inicio';
  }

  // Helpers para el HTML
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