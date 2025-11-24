import { Component, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  jwtHelper = new JwtHelperService();
  tokenSignal = signal<string | null>(null);

  isLoggedIn = computed(() =>
    typeof window !== 'undefined' &&
    this.tokenSignal() !== null &&
    !this.jwtHelper.isTokenExpired(this.tokenSignal()!)
  );

  constructor(private router: Router) {
    if (typeof window !== 'undefined') {
      this.tokenSignal.set(sessionStorage.getItem('token'));
      effect(() => {
        const token = sessionStorage.getItem('token');
        this.tokenSignal.set(token);
      });
    }
  }

  getUsername(): string {
    const token = this.tokenSignal();
    if (!token) return '';
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded.sub || 'Usuario';
  }

  logout(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('token');
    this.tokenSignal.set(null);
    this.router.navigate(['/landing']); // ✅ redirige al landing
    }
  }

  goToLanding(): void {
    this.router.navigate(['/landing']);
  }
}
