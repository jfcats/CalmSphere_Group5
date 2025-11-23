import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Menu } from './components/menu/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [Menu, RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CalmSphere_Frontend');

  constructor(private router: Router) {}

  esHome(): boolean {
    const url = this.router.url;
    return url === '/' || url === '/home' || url.startsWith('/landing');
  }
}
