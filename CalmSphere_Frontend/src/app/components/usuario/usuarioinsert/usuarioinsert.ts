import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Usuario } from '../../../models/usuario';
import { Usuarioservice } from '../../../services/usuarioservice';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

/* ===== VALIDADORES PERSONALIZADOS ===== */

// Validador: Solo letras y espacios (Permite nombres compuestos)
function soloLetras() {
  return (control: AbstractControl): ValidationErrors | null => {
    // Regex: Letras (a-z), Ñ, tildes, y espacios en blanco
    // ^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$
    const regex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/; 
    if (!control.value) return null; 
    return regex.test(control.value) ? null : { patternInvalido: true };
  };
}

function emailValido() {
  return (c: AbstractControl): ValidationErrors | null => {
    // Regex estándar para email
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!c.value) return null;
    return regex.test(c.value) ? null : { emailInvalido: true };
  };
}

function passwordsIguales(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('contrasena')?.value;
  const confirm = group.get('confirmarContrasena')?.value;
  return pass === confirm ? null : { passwordNoCoincide: true };
}

function mayorDe18(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const fechaNac = new Date(control.value);
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  
  return edad >= 18 ? null : { menorDeEdad: true };
}

@Component({
  selector: 'app-usuarioinsert',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    CommonModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './usuarioinsert.html',
  styleUrl: './usuarioinsert.css',
})
export class Usuarioinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  usuario: Usuario = new Usuario();
  id: number = 0;
  edicion: boolean = false;
  isPublic: boolean = false;

  today = new Date();
  isSaving = false;

  // Visibilidad independiente
  hidePass = true;
  hidePass2 = true;

  constructor(
    private uS: Usuarioservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isPublic = this.router.url.includes('/registro');

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group(
      {
        idUsuario: [0], 
        nombre: ['', [Validators.required, Validators.minLength(2), soloLetras()]],
        apellido: ['', [Validators.required, Validators.minLength(2), soloLetras()]],
        email: ['', [Validators.required, Validators.email, emailValido()]],
        contrasena: ['', [Validators.required, Validators.minLength(6)]],
        confirmarContrasena: ['', [Validators.required]],
        fechaNacimiento: ['', [Validators.required, mayorDe18]],
        fechaRegistro: [this.onlyDate(this.today)],
      },
      { validators: [passwordsIguales] } 
    );
  }

  private onlyDate(value: Date | string): string {
    const date = new Date(value);
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private formatDate(value: any): string {
    if (!value) return '';
    return this.onlyDate(value);
  }

  aceptar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); 
      return;
    }

    const v = this.form.getRawValue();

    const dto: any = {
      idUsuario: v.idUsuario,
      nombre: v.nombre,
      apellido: v.apellido,
      email: v.email,
      contraseña: v.contrasena, 
      fechaNacimiento: this.formatDate(v.fechaNacimiento),
      fechaRegistro: this.formatDate(v.fechaRegistro),
    };

    this.isSaving = true;

    const obs = this.edicion ? this.uS.update(dto) : this.uS.insert(dto);

    obs.subscribe({
      next: () => {
        if (this.isPublic) {
          this.isSaving = false;
          alert('¡Bienvenido a CalmSphere! Tu cuenta ha sido creada.');
          this.router.navigate(['login']);
        } else {
          this.uS.list().subscribe((data) => {
            this.uS.setList(data);
            this.isSaving = false;
            this.router.navigate(['usuarios']);
          });
        }
      },
      error: (err) => {
        console.error(err);
        this.isSaving = false;
        // Mensaje más descriptivo si es error 500
        if(err.status === 500) {
             alert('Error interno del servidor. Verifica que el correo no esté duplicado o que los datos sean correctos.');
        } else {
             alert('Ocurrió un error al procesar la solicitud.');
        }
      },
    });
  }

  cancel(): void {
    if (this.isPublic) {
      this.router.navigate(['landing']);
    } else {
      this.router.navigate(['usuarios']);
    }
  }

  init() {
    if (this.edicion) {
      this.uS.listId(this.id).subscribe((data) => {
        this.form.patchValue({
          idUsuario: data.idUsuario,
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          contrasena: data.contraseña,
          confirmarContrasena: data.contraseña,
          fechaNacimiento: data.fechaNacimiento,
          fechaRegistro: this.onlyDate(new Date())
        });
      });
    }
  }
  
  get titulo(): string {
    if (this.edicion) return 'Editar Perfil';
    return this.isPublic ? 'Crear mi Cuenta' : 'Registrar Nuevo Usuario';
  }

  get subtitulo(): string {
    if (this.edicion) return 'Actualiza la información del usuario.';
    return this.isPublic 
      ? 'Completa tus datos para unirte a CalmSphere.'
      : 'Ingresa los datos para dar de alta un usuario en el sistema.';
  }

  get textoBoton(): string {
    if (this.edicion) return 'Guardar Cambios';
    return this.isPublic ? 'Registrarme' : 'Crear Usuario';
  }
}