import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Rol } from '../../../models/rol';
import { Rolservice } from '../../../services/rolservice';

@Component({
  selector: 'app-rollist',
  imports: [MatTableModule, CommonModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './rollist.html',
  styleUrl: './rollist.css',
})
export class Rollist implements OnInit {
  dataSource: MatTableDataSource<Rol> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4'];

  constructor(private rS: Rolservice) {}

  ngOnInit(): void {
    this.rS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.rS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
}

  eliminar(id: number) {
    this.rS.delete(id).subscribe(() => {
      this.rS.list().subscribe((data) => {
        this.rS.setList(data);
      });
    });
  }
}