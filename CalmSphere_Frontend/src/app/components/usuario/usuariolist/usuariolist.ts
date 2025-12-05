import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Usuarioservice } from '../../../services/usuarioservice';
import { Usuario } from '../../../models/usuario';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuariolist',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './usuariolist.html',
  styleUrl: './usuariolist.css',
})
export class Usuariolist implements OnInit {
  // Quitamos 'username' y 'estado' de las columnas visibles
  displayedColumns: string[] = ['nombre', 'apellido', 'email', 'rol', 'acciones'];
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Filtros
  filtroTexto: string = '';
  filtroRol: string = '';

  usuariosOriginales: Usuario[] = [];

  constructor(private uS: Usuarioservice) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.uS.getList().subscribe((data) => {
      this.dataSource.data = data;
      this.usuariosOriginales = data;
      this.aplicarFiltros();
    });
  }

  cargarUsuarios() {
    this.uS.list().subscribe((data) => {
      this.dataSource.data = data;
      this.usuariosOriginales = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  aplicarFiltros() {
    let datosFiltrados = this.usuariosOriginales;

    // 1. Filtro Texto (Nombre, Apellido, Email)
    if (this.filtroTexto) {
      const texto = this.filtroTexto.toLowerCase();
      datosFiltrados = datosFiltrados.filter(u => 
        u.nombre.toLowerCase().includes(texto) ||
        u.apellido.toLowerCase().includes(texto) ||
        u.email.toLowerCase().includes(texto)
      );
    }

    // 2. Filtro Rol
    if (this.filtroRol) {
        datosFiltrados = datosFiltrados.filter(u => 
            u.roles.some(r => r.tipoRol === this.filtroRol)
        );
    }

    this.dataSource.data = datosFiltrados;
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  eliminar(id: number) {
    if(confirm('¿Estás seguro de eliminar este usuario?')) {
        this.uS.delete(id).subscribe(() => {
            this.cargarUsuarios();
        });
    }
  }

  // Helpers visuales
  getRolPrincipal(u: Usuario): string {
    if (!u.roles || u.roles.length === 0) return 'Sin Rol';
    // Prioridad visual: Admin > Profesional > Paciente
    if (u.roles.some(r => r.tipoRol === 'ADMIN')) return 'ADMIN';
    if (u.roles.some(r => r.tipoRol === 'PROFESIONAL')) return 'PROFESIONAL';
    return 'PACIENTE'; 
  }

  getRolClass(rol: string): string {
    switch (rol) {
        case 'ADMIN': return 'badge-admin';
        case 'PROFESIONAL': return 'badge-pro';
        case 'PACIENTE': return 'badge-cliente';
        default: return 'badge-default';
    }
  }
}