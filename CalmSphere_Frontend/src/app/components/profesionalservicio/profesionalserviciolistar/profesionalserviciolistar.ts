import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { ProfesionalServicio } from '../../../models/profesionalservicio';
import { Profesionalservicioservice } from '../../../services/profesionalservicioservice';

@Component({
  selector: 'app-profesionalserviciolistar',
  imports: [MatTableModule, CommonModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './profesionalserviciolistar.html',
  styleUrl: './profesionalserviciolistar.css',
})
export class Profesionalserviciolistar implements OnInit {
  dataSource: MatTableDataSource<ProfesionalServicio> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];

  constructor(private psS: Profesionalservicioservice) {}

  ngOnInit(): void {
    this.psS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.psS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    this.psS.delete(id).subscribe(() => {
      this.psS.list().subscribe((data) => {
        this.psS.setList(data);
      });
    });
  }
}