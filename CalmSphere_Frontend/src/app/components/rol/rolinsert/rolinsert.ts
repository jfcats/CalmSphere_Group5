import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Rol } from '../../../models/rol';
import { Usuario } from '../../../models/usuario';
import { Rolservice } from '../../../services/rolservice';
import { Usuarioservice } from '../../../services/usuarioservice';

@Component({
  selector: 'app-rolinsert',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatButtonModule, 
    MatInputModule, MatSelectModule, MatChipsModule,
    MatIconModule, CommonModule
  ],
  templateUrl: './rolinsert.html',
  styleUrl: './rolinsert.css',
})
export class Rolinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  id: number = 0;
  edicion: boolean = false;
  
  usuarios: Usuario[] = [];
  rolesDisponibles: string[] = ['ADMIN', 'PROFESIONAL', 'PACIENTE'];
  rolesSeleccionados: string[] = [];

  constructor(
    private rS: Rolservice,
    private uS: Usuarioservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    
    this.form = this.formBuilder.group({
      idUsuario: ['', Validators.required] 
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      if (this.edicion) {
        this.initEdicion();
      }
    });
  }

  cargarUsuarios() {
    this.uS.list().subscribe(data => {
      this.usuarios = data;
    });
  }

  // --- LÓGICA NUEVA: Se ejecuta al seleccionar en el Dropdown ---
  detectarRoles(idUsuarioSeleccionado: number) {
    this.rolesSeleccionados = []; // Limpiamos selección anterior
    
    this.rS.list().subscribe(todosLosRoles => {
      this.rolesSeleccionados = todosLosRoles
        .filter(r => {
           // Verificamos si el ID viene como objeto o como número directo
           const rUserId = r.idUsuario?.idUsuario || (r.idUsuario as any);
           return rUserId === idUsuarioSeleccionado;
        })
        .map(r => r.tipoRol); // Ej: ['ADMIN', 'PACIENTE']
    });
  }
  // -------------------------------------------------------------

  initEdicion() {
    this.rS.listId(this.id).subscribe(rolData => {
      const userId = rolData.idUsuario?.idUsuario || (rolData.idUsuario as any);

      if (userId) {
        this.form.patchValue({ idUsuario: userId });
        this.form.get('idUsuario')?.disable(); 
        
        // Reutilizamos la misma lógica
        this.detectarRoles(userId);
      }
    });
  }

  toggleRol(rol: string) {
    const index = this.rolesSeleccionados.indexOf(rol);
    if (index >= 0) {
      this.rolesSeleccionados.splice(index, 1);
    } else {
      this.rolesSeleccionados.push(rol);
    }
  }

  isSelected(rol: string): boolean {
    // Aseguramos que compare ignorando mayúsculas/minúsculas por seguridad
    return this.rolesSeleccionados.includes(rol);
  }

  aceptar(): void {
    const idUsuario = this.form.getRawValue().idUsuario;

    if (idUsuario) {
      if (this.rolesSeleccionados.length === 0) {
        // Opcional: Permitir guardar sin roles (significa revocar todo)
        // alert("El usuario debe tener al menos un rol asignado.");
      }

      const asignacionDTO = {
        idUsuario: idUsuario,
        roles: this.rolesSeleccionados
      };
      
      this.rS.assignRoles(asignacionDTO).subscribe({
        next: () => {
          this.router.navigate(['roles']);
        },
        error: (e) => {
          console.error('Error asignando roles', e);
        }
      });
    }
  }
  
  cancel() {
    this.router.navigate(['roles']);
  }
}