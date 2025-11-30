import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProfesionalServicio } from '../../../models/profesionalservicio';
import { Profesionalservicioservice } from '../../../services/profesionalservicioservice';
import { Loginservice } from '../../../services/loginservice';
import { Usuarioservice } from '../../../services/usuarioservice'; // Para buscar mi ID
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profesionalserviciolistar',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './profesionalserviciolistar.html',
  styleUrl: './profesionalserviciolistar.css',
})
export class Profesionalserviciolistar implements OnInit {
  dataSource: MatTableDataSource<ProfesionalServicio> = new MatTableDataSource();
  
  constructor(
    private psS: Profesionalservicioservice,
    private loginService: Loginservice,
    private uS: Usuarioservice
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.psS.getList().subscribe(data => {
      this.dataSource = new MatTableDataSource(data); // Actualización reactiva simple
    });
  }

  cargarDatos() {
    // 1. Si es ADMIN, traemos todo
    if (this.isAdmin()) {
        this.psS.list().subscribe(data => {
            this.dataSource = new MatTableDataSource(data);
        });
    } 
    // 2. Si es PROFESIONAL, filtramos solo EL SUYO
    else {
        const email = this.loginService.getUsername();
        if(email) {
            this.uS.list().subscribe(users => {
                const me = users.find(u => u.email === email);
                if(me) {
                    // Opción A: Usar el endpoint searchByUsuario que ya tienes en el service
                    this.psS.searchByUsuario(me.idUsuario).subscribe(servicios => {
                        this.dataSource = new MatTableDataSource(servicios);
                    });
                }
            });
        }
    }
  }

  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminar(id: number) {
    if(confirm('¿Seguro de eliminar este servicio?')){
        this.psS.delete(id).subscribe(() => {
           this.cargarDatos(); // Recargar según rol
        });
    }
  }

  getInitials(name: string): string {
    if (!name) return 'PS';
    const parts = name.split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
  }

  getColorClass(name: string): string {
    const colors = ['bg-purple', 'bg-green', 'bg-blue', 'bg-orange'];
    return colors[name.length % colors.length];
  }

  isAdmin() {
    return this.loginService.showRole().includes('ADMIN');
  }
}