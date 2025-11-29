import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Evento } from '../../../models/evento';
import { Eventoservice } from '../../../services/eventoservice';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-eventolistar',
  standalone: true, // Asegúrate de que sea standalone
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatMenuModule, FormsModule],
  templateUrl: './eventolistar.html',
  styleUrl: './eventolistar.css',
})
export class Eventolistar implements OnInit {
  
  eventos: any[] = []; // Usamos 'any' temporalmente porque el modelo Evento en front aun no tiene los nombres extras
  eventosFiltrados: any[] = [];
  filtroTexto: string = '';

  constructor(private eS: Eventoservice) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.eS.getList().subscribe((data) => {
      this.eventos = data;
      this.filtrar();
    });
  }

  cargarDatos() {
    this.eS.list().subscribe((data) => {
      this.eventos = data;
      this.filtrar();
    });
  }

  filtrar() {
    if (!this.filtroTexto) {
      this.eventosFiltrados = this.eventos;
    } else {
      const texto = this.filtroTexto.toLowerCase();
      this.eventosFiltrados = this.eventos.filter(e => 
        e.motivo.toLowerCase().includes(texto) ||
        (e.nombreProfesional && e.nombreProfesional.toLowerCase().includes(texto)) ||
        (e.nombreUsuario && e.nombreUsuario.toLowerCase().includes(texto))
      );
    }
  }

  eliminar(id: number) {
    if(confirm('¿Deseas cancelar esta cita?')) {
        this.eS.delete(id).subscribe(() => {
            this.cargarDatos();
        });
    }
  }

  // Helpers visuales
  getInitials(name: string): string {
    if (!name) return 'C';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }

  getColorClass(estado: boolean): string {
    return estado ? 'bg-green' : 'bg-gray'; // Activo vs Inactivo
  }
}