import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card'; // <--- NUEVO
import { MatChipsModule } from '@angular/material/chips'; // <--- NUEVO

import { Eventoservice } from '../../../services/eventoservice';
import { Loginservice } from '../../../services/loginservice'; // <--- NUEVO

@Component({
  selector: 'app-eventolistar',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatButtonModule, MatIconModule, 
    MatTableModule, MatPaginatorModule, MatSortModule, FormsModule,
    MatCardModule, MatChipsModule // <--- Agregamos módulos
  ],
  templateUrl: './eventolistar.html',
  styleUrl: './eventolistar.css',
})
export class Eventolistar implements OnInit {
  
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  
  // Agregamos 'pago' a las columnas visibles
  displayedColumns: string[] = ['fecha', 'paciente', 'profesional', 'pago', 'estado', 'monto', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Variable para controlar la vista
  esProfesional: boolean = false;

  constructor(
    private eS: Eventoservice,
    private loginService: Loginservice // <--- Inyectamos
  ) {}

  ngOnInit(): void {
    // 1. Detectar Rol para cambiar la vista
    const rol = this.loginService.showRole(); 
    this.esProfesional = rol.includes('PROFESIONAL');

    this.cargarDatos();
    this.eS.getList().subscribe(data => this.actualizarTabla(data));
  }

  cargarDatos() {
    this.eS.list().subscribe(data => this.actualizarTabla(data));
  }

  actualizarTabla(data: any[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const acumulado = (data.nombreUsuario + data.nombreProfesional + data.motivo).toLowerCase();
      return acumulado.indexOf(filter) !== -1;
    };
  }

  filtrar(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      this.eS.delete(id).subscribe({
        next: () => this.cargarDatos(),
        error: (err) => alert("No se pudo eliminar: " + (err.error?.message || "Error desconocido"))
      });
    }
  }
}