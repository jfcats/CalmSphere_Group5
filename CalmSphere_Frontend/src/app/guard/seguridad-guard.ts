import { CanActivateFn, Router } from '@angular/router';
import { Loginservice } from '../services/loginservice';
import { inject } from '@angular/core';

export const seguridadGuard: CanActivateFn = (route, state) => {
    const lService=inject(Loginservice)
    const router=inject(Router)
    const rpta=lService.verificar();
    if(!rpta){
      router.navigate(['/login']);
      return false;
    }
    return rpta;
};