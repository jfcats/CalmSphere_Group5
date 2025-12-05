import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Metodopagolist } from './metodopagolist/metodopagolist';

@Component({
  selector: 'app-metodopago',
  imports: [RouterOutlet, Metodopagolist],
  templateUrl: './metodopago.html',
  styleUrl: './metodopago.css',
})
export class Metodopago {
  constructor(public route: ActivatedRoute) {}
}
