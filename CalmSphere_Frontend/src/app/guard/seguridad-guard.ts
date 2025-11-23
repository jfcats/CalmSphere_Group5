import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Loginservice } from '../services/loginservice';

export const seguridadGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const lService = inject(Loginservice);
  const router = inject(Router);

  // 1. Verifica autenticación
  if (!lService.verificar()) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Verifica roles si la ruta lo pide
  const rolesPermitidos = route.data?.['roles'] as string[];
  if (rolesPermitidos && rolesPermitidos.length > 0) {
    const rolUsuario = lService.showRole();
    if (!rolUsuario || !rolesPermitidos.includes(rolUsuario)) {
      alert('Acceso denegado');
      router.navigate(['/']);
      return false;
    }
  }

  return true;
};
