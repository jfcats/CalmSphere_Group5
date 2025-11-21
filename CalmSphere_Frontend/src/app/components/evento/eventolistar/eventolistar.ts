import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Evento } from '../../../models/evento';
import { Eventoservice } from '../../../services/eventoservice';

@Component({
  selector: 'app-eventolistar',
  imports: [MatTableModule, CommonModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './eventolistar.html',
  styleUrl: './eventolistar.css',
})
export class Eventolistar implements OnInit {
  dataSource: MatTableDataSource<Evento> = new MatTableDataSource();
  displayedColumns: string[] = [
    'c1', // id
    'c2', // usuario
    'c3', // profesional
    'c4', // metodo pago
    'c5', // inicio
    'c6', // fin
    'c7', // estado
    'c8', // motivo
    'c9', // monto
    'c10', // editar
    'c11', // eliminar
  ];

  constructor(private eS: Eventoservice) {}

  ngOnInit(): void {
    this.eS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.eS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    this.eS.delete(id).subscribe(() => {
      this.eS.list().subscribe((data) => {
        this.eS.setList(data);
      });
    });
  }
}