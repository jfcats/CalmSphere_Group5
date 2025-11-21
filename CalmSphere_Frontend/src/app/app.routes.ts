import { Routes } from '@angular/router';
import { Usuario } from './components/usuario/usuario';
import { Usuariolist } from './components/usuario/usuariolist/usuariolist';
import { Usuarioinsert } from './components/usuario/usuarioinsert/usuarioinsert';
import { Rol } from './components/rol/rol';
import { Rollist } from './components/rol/rollist/rollist';
import { Rolinsert } from './components/rol/rolinsert/rolinsert';

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

  // landing por defecto
  { path: '', redirectTo: '/usuarios', pathMatch: 'full' },
  // opcional: por si alguien escribe una ruta rara
  { path: '**', redirectTo: '/usuarios' },
    
];
