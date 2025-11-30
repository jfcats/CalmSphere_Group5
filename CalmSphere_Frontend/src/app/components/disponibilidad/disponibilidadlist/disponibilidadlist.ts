import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu'; 

// Modelos
import { Disponibilidad } from '../../../models/disponibilidad';

// Servicios
import { Disponibilidadservice } from '../../../services/disponibilidadservice';
import { Profesionalservicioservice } from '../../../services/profesionalservicioservice';
import { Loginservice } from '../../../services/loginservice';
import { Usuarioservice } from '../../../services/usuarioservice'; // Necesario para buscar por email

@Component({
  selector: 'app-disponibilidadlist',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './disponibilidadlist.html',
  styleUrl: './disponibilidadlist.css',
})
export class Disponibilidadlist implements OnInit {
  
  calendario: { [key: number]: Disponibilidad[] } = {};
  diasSemana = [
    { id: 1, nombre: 'Lunes' }, { id: 2, nombre: 'Martes' }, { id: 3, nombre: 'Miércoles' },
    { id: 4, nombre: 'Jueves' }, { id: 5, nombre: 'Viernes' }, { id: 6, nombre: 'Sábado' }, { id: 7, nombre: 'Domingo' },
  ];

  constructor(
    private dS: Disponibilidadservice,
    private psS: Profesionalservicioservice,
    private uS: Usuarioservice,
    private loginService: Loginservice
  ) {}

  ngOnInit(): void {
    this.cargarMisHorarios();
    // Nos suscribimos a cambios en la lista base
    this.dS.getList().subscribe(() => {
      this.cargarMisHorarios();
    });
  }

  cargarMisHorarios() {
    // PASO 1: Saber quién soy (Email desde el Token)
    const myEmail = this.loginService.getUsername(); 

    if (!myEmail) return; // Si no hay usuario, no hacemos nada

    // PASO 2: Buscar mi objeto Usuario usando el email
    this.uS.list().subscribe(users => {
      const myUser = users.find(u => u.email === myEmail);
      
      if (myUser) {
        // PASO 3: Buscar si tengo un Servicio Profesional creado
        this.psS.list().subscribe(servicios => {
          // El servicio que tenga mi ID de usuario
          const myService = servicios.find(s => s.idUsuario === myUser.idUsuario);
          
          if (myService) {
             // PASO 4: Cargar horarios de ESE servicio
             this.dS.list().subscribe(allDisponibilidades => {
               const misHorarios = allDisponibilidades.filter(d => d.idProfesionalServicio === myService.idProfesionalServicio);
               this.organizarCalendario(misHorarios);
             });
          } else {
            console.log("Este usuario no tiene un perfil profesional creado.");
          }
        });
      }
    });
  }

  organizarCalendario(lista: Disponibilidad[]) {
    // Reiniciamos calendario
    this.calendario = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
    
    lista.forEach(d => {
      if (this.calendario[d.diaSemana]) {
        this.calendario[d.diaSemana].push(d);
      }
    });

    // Ordenamos visualmente por hora
    for (let i = 1; i <= 7; i++) {
        this.calendario[i].sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
    }
  }

  eliminar(id: number) {
    if(confirm('¿Deseas eliminar este horario?')) {
        this.dS.delete(id).subscribe(() => {
             // Al eliminar, getList() disparará la recarga en ngOnInit
        });
    }
  }
}