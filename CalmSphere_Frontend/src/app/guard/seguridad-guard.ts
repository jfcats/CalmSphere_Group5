import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const seguridadGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const jwtHelper = new JwtHelperService();

  // ✅ Verificamos que estamos en el navegador antes de usar sessionStorage
  if (typeof window === 'undefined') {
    return false;
  }

  const token = sessionStorage.getItem('token');

  // 🔒 No hay token o está vencido → redirige a login
  if (!token || jwtHelper.isTokenExpired(token)) {
    router.navigate(['/login']);
    return false;
  }

  // 🎯 Verificamos roles (si la ruta lo requiere)
  const rolesPermitidos = route.data?.['roles'] as string[];

  if (rolesPermitidos && rolesPermitidos.length > 0) {
    const decoded = jwtHelper.decodeToken(token);
    const rolUsuario = decoded?.role || '';

    if (!rolesPermitidos.includes(rolUsuario)) {
      alert('Acceso denegado');
      router.navigate(['/']);
      return false;
    }
  }

  return true; // ✅ acceso permitido
};
