import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Eventolistar } from './eventolistar/eventolistar';

@Component({
  selector: 'app-evento',
  imports: [RouterOutlet, Eventolistar],
  templateUrl: './evento.html',
  styleUrl: './evento.css',
})
export class Evento {
  constructor(public route: ActivatedRoute) {}
}
