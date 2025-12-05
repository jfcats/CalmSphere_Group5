import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Profesionalserviciolistar } from './profesionalserviciolistar/profesionalserviciolistar';

@Component({
  selector: 'app-profesionalservicio',
  imports: [RouterOutlet,Profesionalserviciolistar],
  templateUrl: './profesionalservicio.html',
  styleUrl: './profesionalservicio.css',
})
export class Profesionalservicio {
  constructor(public route: ActivatedRoute) {}
}
