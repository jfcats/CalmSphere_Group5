import { Routes } from '@angular/router';

// Guard único (como la profesora)
import { seguridadGuard } from './guard/seguridad-guard';

// Rutas públicas
import { Home } from './components/home/home';
import { Login } from './components/login/login';

// Layout para mostrar el menú + contenido en rutas privadas
import { Layout } from './components/layout/layout';

// USUARIO
import { Usuario } from './components/usuario/usuario';
import { Usuariolist } from './components/usuario/usuariolist/usuariolist';
import { Usuarioinsert } from './components/usuario/usuarioinsert/usuarioinsert';

// ROL
import { Rol } from './components/rol/rol';
import { Rollist } from './components/rol/rollist/rollist';
import { Rolinsert } from './components/rol/rolinsert/rolinsert';

// DISPONIBILIDAD
import { Disponibilidad } from './components/disponibilidad/disponibilidad';
import { Disponibilidadlist } from './components/disponibilidad/disponibilidadlist/disponibilidadlist';
import { Disponibilidadinsert } from './components/disponibilidad/disponibilidadinsert/disponibilidadinsert';

// MÉTODO DE PAGO
import { Metodopago } from './components/metodopago/metodopago';
import { Metodopagolist } from './components/metodopago/metodopagolist/metodopagolist';
import { Metodopagoinsert } from './components/metodopago/metodopagoinsert/metodopagoinsert';

// PROFESIONAL - SERVICIO
import { Profesionalservicio } from './components/profesionalservicio/profesionalservicio';
import { Profesionalserviciolistar } from './components/profesionalservicio/profesionalserviciolistar/profesionalserviciolistar';
import { Profesionalservicioinsertar } from './components/profesionalservicio/profesionalservicioinsertar/profesionalservicioinsertar';

// EVENTO
import { Evento } from './components/evento/evento';
import { Eventolistar } from './components/evento/eventolistar/eventolistar';
import { Eventoinsert } from './components/evento/eventoinsert/eventoinsert';

export const routes: Routes = [

  // ===========================
  // 🔓 RUTAS PÚBLICAS
  // ===========================
  { path: 'landing', component: Home },
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'login', component: Login },

  // ===========================
  // 🔒 RUTAS PRIVADAS CON LAYOUT
  // ===========================
  {
    path: '',
    component: Layout,
    canActivate: [seguridadGuard],
    children: [

      // EVENTOS
      {
        path: 'eventos',
        component: Evento,
        canActivate: [seguridadGuard],
        children: [
          { path: '', component: Eventolistar },
          { path: 'news', component: Eventoinsert },
          { path: 'edits/:id', component: Eventoinsert },
        ],
      },

      // USUARIOS
      {
        path: 'usuarios',
        component: Usuario,
        canActivate: [seguridadGuard],
        children: [
          { path: '', component: Usuariolist },
          { path: 'news', component: Usuarioinsert },
          { path: 'edits/:id', component: Usuarioinsert },
        ],
      },

      // ROLES
      {
        path: 'roles',
        component: Rol,
        canActivate: [seguridadGuard],
        children: [
          { path: '', component: Rollist },
          { path: 'news', component: Rolinsert },
          { path: 'edits/:id', component: Rolinsert },
        ],
      },

      // DISPONIBILIDADES
      {
        path: 'disponibilidades',
        component: Disponibilidad,
        canActivate: [seguridadGuard],
        children: [
          { path: '', component: Disponibilidadlist },
          { path: 'news', component: Disponibilidadinsert },
          { path: 'edits/:id', component: Disponibilidadinsert },
        ],
      },

      // MÉTODOS DE PAGO
      {
        path: 'metodopagos',
        component: Metodopago,
        canActivate: [seguridadGuard],
        children: [
          { path: '', component: Metodopagolist },
          { path: 'news', component: Metodopagoinsert },
          { path: 'edits/:id', component: Metodopagoinsert },
        ],
      },

      // PROFESIONAL - SERVICIO
      {
        path: 'profesional-servicios',
        component: Profesionalservicio,
        canActivate: [seguridadGuard],
        children: [
          { path: '', component: Profesionalserviciolistar },
          { path: 'news', component: Profesionalservicioinsertar },
          { path: 'edits/:id', component: Profesionalservicioinsertar },
        ],
      },
    ],
  },

  // ===========================
  // WILDCARD
  // ===========================
  { path: '**', redirectTo: '' },
];