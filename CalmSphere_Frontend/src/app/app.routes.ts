import { Routes } from '@angular/router';

// Guards


// Home (Landing)
import { Home } from './components/home/home';

// Login
import { Login } from './components/login/login';

// Usuario
import { Usuario } from './components/usuario/usuario';
import { Usuariolist } from './components/usuario/usuariolist/usuariolist';
import { Usuarioinsert } from './components/usuario/usuarioinsert/usuarioinsert';

// Rol
import { Rol } from './components/rol/rol';
import { Rollist } from './components/rol/rollist/rollist';
import { Rolinsert } from './components/rol/rolinsert/rolinsert';

// Disponibilidad
import { Disponibilidad } from './components/disponibilidad/disponibilidad';
import { Disponibilidadlist } from './components/disponibilidad/disponibilidadlist/disponibilidadlist';
import { Disponibilidadinsert } from './components/disponibilidad/disponibilidadinsert/disponibilidadinsert';

// Método de pago
import { Metodopago } from './components/metodopago/metodopago';
import { Metodopagolist } from './components/metodopago/metodopagolist/metodopagolist';
import { Metodopagoinsert } from './components/metodopago/metodopagoinsert/metodopagoinsert';

// Profesional - Servicio
import { Profesionalservicio } from './components/profesionalservicio/profesionalservicio';
import { Profesionalserviciolistar } from './components/profesionalservicio/profesionalserviciolistar/profesionalserviciolistar';
import { Profesionalservicioinsertar } from './components/profesionalservicio/profesionalservicioinsertar/profesionalservicioinsertar';

// Evento
import { Evento } from './components/evento/evento';
import { Eventolistar } from './components/evento/eventolistar/eventolistar';
import { Eventoinsert } from './components/evento/eventoinsert/eventoinsert';
import { publicGuard } from './guard/public-guard';
import { seguridadGuard } from './guard/seguridad-guard';

export const routes: Routes = [

  // ===========================
  // PUBLIC ROUTES
  // ===========================
  {
    path: '',
    component: Home,
    canActivate: [publicGuard]
  },
  {
    path: 'login',
    component: Login,
    canActivate: [publicGuard]
  },

  // ===========================
  // PRIVATE ROUTES (SEGURIDADGUARD)
  // ===========================

  // --- USUARIOS (ADMIN) ---
  {
    path: 'usuarios',
    component: Usuario,
    canActivate: [seguridadGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', component: Usuariolist },
      { path: 'news', component: Usuarioinsert },
      { path: 'edits/:id', component: Usuarioinsert }
    ]
  },

  // --- ROLES (ADMIN) ---
  {
    path: 'roles',
    component: Rol,
    canActivate: [seguridadGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', component: Rollist },
      { path: 'news', component: Rolinsert },
      { path: 'edits/:id', component: Rolinsert }
    ]
  },

  // --- DISPONIBILIDADES (ADMIN, PROFESIONAL) ---
  {
    path: 'disponibilidades',
    component: Disponibilidad,
    canActivate: [seguridadGuard],
    data: { roles: ['ADMIN', 'PROFESIONAL'] },
    children: [
      { path: '', component: Disponibilidadlist },
      { path: 'news', component: Disponibilidadinsert },
      { path: 'edits/:id', component: Disponibilidadinsert }
    ]
  },

  // --- MÉTODO DE PAGO (ADMIN, PROFESIONAL, PACIENTE) ---
  {
    path: 'metodopagos',
    component: Metodopago,
    canActivate: [seguridadGuard],
    data: { roles: ['ADMIN', 'PROFESIONAL', 'PACIENTE'] },
    children: [
      { path: '', component: Metodopagolist },
      { path: 'news', component: Metodopagoinsert },
      { path: 'edits/:id', component: Metodopagoinsert }
    ]
  },

  // --- PROFESIONAL-SERVICIOS (ADMIN, PROFESIONAL) ---
  {
    path: 'profesional-servicios',
    component: Profesionalservicio,
    canActivate: [seguridadGuard],
    data: { roles: ['ADMIN', 'PROFESIONAL'] },
    children: [
      { path: '', component: Profesionalserviciolistar },
      { path: 'news', component: Profesionalservicioinsertar },
      { path: 'edits/:id', component: Profesionalservicioinsertar }
    ]
  },

  // --- EVENTOS (ADMIN, PROFESIONAL, PACIENTE) ---
  {
    path: 'eventos',
    component: Evento,
    canActivate: [seguridadGuard],
    data: { roles: ['ADMIN', 'PROFESIONAL', 'PACIENTE'] },
    children: [
      { path: '', component: Eventolistar },
      { path: 'news', component: Eventoinsert },
      { path: 'edits/:id', component: Eventoinsert }
    ]
  },

  // ===========================
  // WILDCARD
  // ===========================
  { path: '**', redirectTo: '' }
];
