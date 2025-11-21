import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Rollist } from './rollist/rollist';

@Component({
  selector: 'app-rol',
  imports: [RouterOutlet, Rollist],
  templateUrl: './rol.html',
  styleUrl: './rol.css',
})
export class Rol {
  constructor(public route: ActivatedRoute) {}
}
