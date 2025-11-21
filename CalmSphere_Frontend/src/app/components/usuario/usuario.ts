import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Usuariolist } from './usuariolist/usuariolist';

@Component({
  selector: 'app-usuario',
  imports: [RouterOutlet, Usuariolist],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class Usuario {

  constructor(public route:ActivatedRoute){}

}
