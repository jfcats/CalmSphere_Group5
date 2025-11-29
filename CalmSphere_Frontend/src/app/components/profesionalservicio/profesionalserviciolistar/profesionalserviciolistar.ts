import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProfesionalServicio } from '../../../models/profesionalservicio';
import { Profesionalservicioservice } from '../../../services/profesionalservicioservice';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Loginservice } from '../../../services/loginservice'; // Para verificar si es admin

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
    private loginService: Loginservice
  ) {}

  ngOnInit(): void {
    this.psS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.psS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminar(id: number) {
    if(confirm('¿Seguro de eliminar este profesional?')){
        this.psS.delete(id).subscribe(() => {
        this.psS.list().subscribe((data) => {
            this.psS.setList(data);
        });
        });
    }
  }

  // Helpers visuales
  getInitials(name: string): string {
    if (!name) return 'PS';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  getColorClass(name: string): string {
    const colors = ['bg-purple', 'bg-green', 'bg-blue', 'bg-orange'];
    // Hash simple para que el color sea consistente por nombre
    const index = name.length % colors.length;
    return colors[index];
  }

  isAdmin() {
    return this.loginService.showRole().includes('ADMIN');
  }

  verPerfil(id: number) {
    // Aquí iríamos a la vista de detalle/agenda de ese médico
    // Por ahora, un alert o navegación futura
    console.log("Ver perfil de:", id);
  }
}