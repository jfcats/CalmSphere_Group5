import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Usuario } from '../../../models/usuario';
import { Usuarioservice } from '../../../services/usuarioservice';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-usuarioinsert',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,],
  templateUrl: './usuarioinsert.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './usuarioinsert.css',
})

export class Usuarioinsert implements OnInit{
  form: FormGroup = new FormGroup({});
  usuario: Usuario = new Usuario();
  id: number = 0;
  edicion: boolean = false;
  today = new Date();

  constructor(
    private uS: Usuarioservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      idUsuario: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      fechaRegistro: ['', Validators.required],
    });
  }

    private formatDate(value: any): string {
      if (!value) return '';

      const date = new Date(value);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      return `${year}-${month}-${day}`;
    }

    aceptar(): void {
    if (this.form.valid) {
      const v = this.form.value;

      // Ensamblamos el objeto EXACTO que espera el backend
      const dto: any = {
        idUsuario: v.idUsuario,
        nombre: v.nombre,
        apellido: v.apellido,
        email: v.email,
        contraseña: v.contrasena,   // ← aquí va con ñ para el backend
        fechaNacimiento: this.formatDate(v.fechaNacimiento),
        fechaRegistro: this.formatDate(v.fechaRegistro),
      };

      if (this.edicion) {
        this.uS.update(dto).subscribe(() => {
          this.uS.list().subscribe((data) => {
            this.uS.setList(data);
            this.router.navigate(['usuarios']);  
          });
        });
      } else {
        this.uS.insert(dto).subscribe(() => {
          this.uS.list().subscribe((data) => {
            this.uS.setList(data);
            this.router.navigate(['usuarios']); 
          });
        });
      }

      this.router.navigate(['usuarios']);
    } else {
      this.form.markAllAsTouched();
      alert('Por favor complete todos los campos.');
    }
  }

  init() {
    if (this.edicion) {
      this.uS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idUsuario: new FormControl(data.idUsuario),
          nombre: new FormControl(data.nombre),
          apellido: new FormControl(data.apellido),
          email: new FormControl(data.email),
          contrasena: new FormControl(data.contraseña), 
          fechaNacimiento: new FormControl(data.fechaNacimiento),
          fechaRegistro: new FormControl(data.fechaRegistro),
        });
      });
    }
  }
}