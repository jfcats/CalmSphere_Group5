import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from '../menu/menu';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Menu, RouterOutlet],
  templateUrl: './layout.html'
})
export class Layout {}
