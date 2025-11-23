import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Loginservice } from '../services/loginservice';

export const publicGuard: CanActivateFn = () => {
  const loginservice = inject(Loginservice);
  const router = inject(Router);

  // Si el usuario YA está autenticado
  if (loginservice.verificar()) {
    router.navigate(['/eventos']); // o dashboard, o home interno
    return false;
  }

  return true; // permite entrar a login/landing
};
