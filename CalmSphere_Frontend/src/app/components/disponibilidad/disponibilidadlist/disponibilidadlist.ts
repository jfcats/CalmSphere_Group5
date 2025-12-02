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
import { Usuarioservice } from '../../../services/usuarioservice';

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
    this.dS.getList().subscribe(() => {
      this.cargarMisHorarios();
    });
  }

  cargarMisHorarios() {
    const email = this.loginService.getUsername(); 

    if (email) {
        this.uS.listByEmail(email).subscribe(myUser => {
            if (myUser) {
                // Buscamos TODOS los servicios asociados a este usuario
                this.psS.searchByUsuario(myUser.idUsuario).subscribe(servicios => {
                    
                    if (servicios.length > 0) {
                        
                        // CAMBIO CRÍTICO: Obtenemos una lista de IDs de TODOS tus servicios
                        // Ej: [1, 2, 5] (Psicología, Terapia, Coaching)
                        const misIdsDeServicio = servicios.map(s => s.idProfesionalServicio);
                        
                        this.dS.list().subscribe({
                            next: (allDisponibilidades) => {
                                // Filtramos si el ID del horario está incluido en TU lista de servicios
                                const misHorarios = allDisponibilidades.filter(d => 
                                    misIdsDeServicio.includes(d.idProfesionalServicio)
                                );
                                this.organizarCalendario(misHorarios);
                            },
                            error: (err) => {
                                console.log("Lista vacía o error de conexión");
                                this.organizarCalendario([]); 
                            }
                        });

                    } else {
                        console.log("Aún no tienes un servicio profesional creado.");
                    }
                });
            }
        });
    }
  }

  organizarCalendario(lista: Disponibilidad[]) {
    this.calendario = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
    
    lista.forEach(d => {
      if (this.calendario[d.diaSemana]) {
        this.calendario[d.diaSemana].push(d);
      }
    });

    for (let i = 1; i <= 7; i++) {
        this.calendario[i].sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
    }
  }

  eliminar(id: number) {
    if(confirm('¿Deseas eliminar este horario?')) {
        this.dS.delete(id).subscribe(() => {
             this.dS.list().subscribe(data => this.dS.setList(data));
        });
    }
  }
}