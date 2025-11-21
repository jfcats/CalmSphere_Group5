import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Disponibilidadlist } from './disponibilidadlist/disponibilidadlist';

@Component({
  selector: 'app-disponibilidad',
  imports: [RouterOutlet, Disponibilidadlist],
  templateUrl: './disponibilidad.html',
  styleUrl: './disponibilidad.css',
})
export class Disponibilidad {
  constructor(public route: ActivatedRoute) {}
}
