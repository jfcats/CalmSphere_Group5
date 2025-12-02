import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { Eventoservice } from '../../../services/eventoservice';

@Component({
  selector: 'app-eventolistar',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatButtonModule, MatIconModule, 
    MatTableModule, MatPaginatorModule, MatSortModule, FormsModule
  ],
  templateUrl: './eventolistar.html',
  styleUrl: './eventolistar.css',
})
export class Eventolistar implements OnInit {
  
  // Fuente de datos para la tabla
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  
  // Columnas exactas del diseño
  displayedColumns: string[] = ['fecha', 'paciente', 'profesional', 'estado', 'monto', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private eS: Eventoservice) {}

  ngOnInit(): void {
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
    
    // Filtro personalizado (opcional) para buscar en campos anidados
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
      this.eS.delete(id).subscribe(() => {
        this.cargarDatos(); // Recargar la tabla tras eliminar
      });
    }
  }
}