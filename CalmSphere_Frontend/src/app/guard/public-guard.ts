import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const publicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const jwtHelper = new JwtHelperService();

  // ✅ Verifica que estás en navegador
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('token');
    const isLoggedIn = token && !jwtHelper.isTokenExpired(token);

    if (isLoggedIn) {
      router.navigate(['/eventos']);
      return false;
    }
  }

  return true; // permite acceder a login o landing
};
