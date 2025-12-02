import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { provideNgxStripe } from 'ngx-stripe';

export function tokenGetter() {
  if (typeof window === 'undefined') {
    return null;
  }
  const token = window.sessionStorage.getItem('token');
  return token && token.split('.').length === 3 ? token : null;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // === AQUÍ VA TU CLAVE PÚBLICA ===
    provideNgxStripe('pk_test_51SZbSORxQ8RAFGuoHAR7gyKNTv7zsUQuAmwbiWMZkUSlqz9QKK7BXywmCHPTibE90XqQuhTVK7sz2crBNRA4p7Ei004gSiEj0q'),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(),withInterceptorsFromDi()),
        importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['localhost:8080'],
          disallowedRoutes: ['http://localhost:8080/login/forget'],
        },
      })
    )
  ]
};