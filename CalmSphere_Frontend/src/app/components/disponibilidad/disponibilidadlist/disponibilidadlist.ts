import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Disponibilidad } from '../../../models/disponibilidad';
import { Disponibilidadservice } from '../../../services/disponibilidadservice';
import { MatMenuModule } from '@angular/material/menu'; // Para el menú de 3 puntitos

@Component({
  selector: 'app-disponibilidadlist',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './disponibilidadlist.html',
  styleUrl: './disponibilidadlist.css',
})
export class Disponibilidadlist implements OnInit {
  
  // Estructura para el calendario: { 1: [DispA, DispB], 2: [], ... }
  calendario: { [key: number]: Disponibilidad[] } = {};
  
  // Mapeo fijo para las columnas del grid
  diasSemana = [
    { id: 1, nombre: 'Lunes' },
    { id: 2, nombre: 'Martes' },
    { id: 3, nombre: 'Miércoles' },
    { id: 4, nombre: 'Jueves' },
    { id: 5, nombre: 'Viernes' },
    { id: 6, nombre: 'Sábado' },
    { id: 7, nombre: 'Domingo' },
  ];

  constructor(private dS: Disponibilidadservice) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.dS.getList().subscribe(() => {
      this.cargarDatos();
    });
  }

  cargarDatos() {
    this.dS.list().subscribe((data) => {
      this.organizarCalendario(data);
    });
  }

  // Transforma la lista plana de BD en un objeto agrupado por días
  organizarCalendario(lista: Disponibilidad[]) {
    // 1. Reiniciamos el calendario vacío
    this.calendario = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
    
    // 2. Llenamos los días
    lista.forEach(d => {
      if (this.calendario[d.diaSemana]) {
        this.calendario[d.diaSemana].push(d);
      }
    });

    // 3. Ordenamos por hora de inicio (para que las de las 9am salgan antes que las de las 3pm)
    for (let i = 1; i <= 7; i++) {
        this.calendario[i].sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
    }
  }

  eliminar(id: number) {
    // Confirmación simple antes de borrar
    if(confirm('¿Deseas eliminar este horario?')) {
        this.dS.delete(id).subscribe(() => {
            this.cargarDatos(); // Recargar la vista
        });
    }
  }
}