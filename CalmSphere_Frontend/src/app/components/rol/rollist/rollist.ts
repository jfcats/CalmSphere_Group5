import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Rol } from '../../../models/rol';
import { Rolservice } from '../../../services/rolservice';

@Component({
  selector: 'app-rollist',
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
    FormsModule
  ],
  templateUrl: './rollist.html',
  styleUrl: './rollist.css',
})
export class Rollist implements OnInit {
  dataSource: MatTableDataSource<Rol> = new MatTableDataSource();
  // Columnas visuales
  displayedColumns: string[] = ['usuario', 'rol', 'acciones'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filtro: string = '';

  constructor(private rS: Rolservice) {}

  ngOnInit(): void {
    this.cargarRoles();
    this.rS.getList().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  cargarRoles() {
    this.rS.list().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      
      // Filtro personalizado: busca en nombre, apellido o rol
      this.dataSource.filterPredicate = (data: Rol, filter: string) => {
        const userName = data.idUsuario?.nombre?.toLowerCase() || '';
        const userLastName = data.idUsuario?.apellido?.toLowerCase() || '';
        const roleName = data.tipoRol.toLowerCase();
        return userName.includes(filter) || userLastName.includes(filter) || roleName.includes(filter);
      };
    });
  }

  aplicarFiltro() {
    this.dataSource.filter = this.filtro.trim().toLowerCase();
  }

  eliminar(id: number) {
    if(confirm('¿Estás seguro de revocar este rol?')) {
        this.rS.delete(id).subscribe(() => {
            this.cargarRoles();
        });
    }
  }

  getRoleClass(rol: string): string {
    switch (rol) {
      case 'ADMIN': return 'badge-admin';
      case 'PROFESIONAL': return 'badge-pro';
      case 'PACIENTE': return 'badge-cliente';
      default: return 'badge-default';
    }
  }
}