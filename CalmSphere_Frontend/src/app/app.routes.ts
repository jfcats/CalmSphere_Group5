import { Routes } from '@angular/router';
import { Usuario } from './components/usuario/usuario';
import { Usuariolist } from './components/usuario/usuariolist/usuariolist';
import { Usuarioinsert } from './components/usuario/usuarioinsert/usuarioinsert';
import { Rol } from './components/rol/rol';
import { Rollist } from './components/rol/rollist/rollist';
import { Rolinsert } from './components/rol/rolinsert/rolinsert';
import { Disponibilidad } from './components/disponibilidad/disponibilidad';
import { Disponibilidadlist } from './components/disponibilidad/disponibilidadlist/disponibilidadlist';
import { Disponibilidadinsert } from './components/disponibilidad/disponibilidadinsert/disponibilidadinsert';
import { Metodopago } from './components/metodopago/metodopago';
import { Metodopagolist } from './components/metodopago/metodopagolist/metodopagolist';
import { Metodopagoinsert } from './components/metodopago/metodopagoinsert/metodopagoinsert';
import { Profesionalservicio } from './components/profesionalservicio/profesionalservicio';
import { Profesionalservicioinsertar } from './components/profesionalservicio/profesionalservicioinsertar/profesionalservicioinsertar';
import { Profesionalserviciolistar } from './components/profesionalservicio/profesionalserviciolistar/profesionalserviciolistar';
import { Evento } from './components/evento/evento';
import { Eventoinsert } from './components/evento/eventoinsert/eventoinsert';
import { Eventolistar } from './components/evento/eventolistar/eventolistar';

export const routes: Routes = [
{
    path: 'usuarios',
    component: Usuario,
    children: [
      { path: '', component: Usuariolist },          // listar
      { path: 'news', component: Usuarioinsert },    // registrar
      { path: 'edits/:id', component: Usuarioinsert } // editar
    ],
  },
  {
    path: 'roles',
    component: Rol,
    children: [
      { path: '', component: Rollist },              // listar
      { path: 'news', component: Rolinsert },        // registrar
      { path: 'edits/:id', component: Rolinsert },   // editar
    ],
  },

{
    path: 'disponibilidades',
    component: Disponibilidad,
    children: [
      { path: '', component: Disponibilidadlist },
      { path: 'news', component: Disponibilidadinsert },
      { path: 'edits/:id', component: Disponibilidadinsert },
    ],
  },

  {
    path: 'metodopagos',
    component: Metodopago,
    children: [
      { path: '', component: Metodopagolist },
      { path: 'news', component: Metodopagoinsert },
      { path: 'edits/:id', component: Metodopagoinsert },
    ],
  },
  {
    path: 'profesional-servicios',
    component: Profesionalservicio,
    children: [
      { path: 'news', component: Profesionalservicioinsertar },
      { path: 'edits/:id', component: Profesionalservicioinsertar },
      { path: '', component: Profesionalserviciolistar },
    ],
  },

  
  {
    path: 'eventos',
    component: Evento,
    children: [
      { path: 'news', component: Eventoinsert },
      { path: 'edits/:id', component: Eventoinsert },
      { path: '', component: Eventolistar },
    ],
  },

  { path: '', redirectTo: '/usuarios', pathMatch: 'full' },

];