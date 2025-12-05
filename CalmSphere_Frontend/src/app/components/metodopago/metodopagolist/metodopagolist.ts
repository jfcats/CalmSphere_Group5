import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { Metodopagoservice } from '../../../services/metodopagoservice';

@Component({
  selector: 'app-metodopagolist',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, RouterLink, MatButtonModule, 
    MatIconModule, MatTooltipModule, MatPaginatorModule, MatSortModule
  ],
  templateUrl: './metodopagolist.html',
  styleUrl: './metodopagolist.css',
})
export class Metodopagolist implements OnInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  
  // SIN ID, CON ESTADO
  displayedColumns: string[] = ['nombre', 'tipo', 'estado', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private mS: Metodopagoservice) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.mS.getList().subscribe(data => this.actualizarTabla(data));
  }

  cargarDatos() {
    this.mS.list().subscribe(data => this.actualizarTabla(data));
  }

  actualizarTabla(data: any[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filtrar(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(id: number) {
    if(confirm('¿Seguro que deseas desactivar este método de pago?')) {
        this.mS.delete(id).subscribe(() => {
            this.cargarDatos();
        });
    }
  }
}