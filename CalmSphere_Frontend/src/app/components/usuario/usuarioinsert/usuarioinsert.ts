import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'; // <--- IMPORTANTE
import { Usuario } from '../../../models/usuario';
import { Usuarioservice } from '../../../services/usuarioservice';
import { ActivatedRoute, Params, Router } from '@angular/router';

/* ===== Helpers de validación ===== */
function emailValido() {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return (c: AbstractControl): ValidationErrors | null =>
    !c.value || regex.test(c.value) ? null : { emailInvalido: true };
}

function passwordsIguales(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('contrasena')?.value;
  const rep  = group.get('confirmarContrasena')?.value;
  // Solo devolvemos error si ambos campos tienen valor y son diferentes
  return pass && rep && pass !== rep ? { passwordNoCoincide: true } : null;
}

function mayorDe18(control: AbstractControl): ValidationErrors | null {
  const v = control.value;
  if (!v) return null;
  const nac = new Date(v);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad >= 18 ? null : { menorDeEdad: true };
}

function fechaEsHoy(control: AbstractControl): ValidationErrors | null {
  const v = control.value as Date | string | null;
  if (!v) return { requerida: true };
  const d = new Date(v);
  const hoy = new Date();
  const same =
    d.getFullYear() === hoy.getFullYear() &&
    d.getMonth() === hoy.getMonth() &&
    d.getDate() === hoy.getDate();
  return same ? null : { noEsHoy: true };
}

@Component({
  selector: 'app-usuarioinsert',
  standalone: true, // Asegurando que sea standalone
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule // <--- Agregado para el ícono del ojo
  ],
  templateUrl: './usuarioinsert.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './usuarioinsert.css',
})
export class Usuarioinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  usuario: Usuario = new Usuario();
  id: number = 0;
  edicion: boolean = false;

  today = new Date();
  isSaving = false;

  // Variables para controlar la visibilidad de las contraseñas
  hidePass = true;
  hidePass2 = true;

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

    this.form = this.formBuilder.group(
      {
        idUsuario: [''],
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        apellido: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email, emailValido()]],
        contrasena: ['', [Validators.required, Validators.minLength(5)]],
        confirmarContrasena: ['', [Validators.required]],
        fechaNacimiento: ['', [Validators.required, mayorDe18]],
        fechaRegistro: [{ value: this.onlyDate(this.today), disabled: true }, [fechaEsHoy]],
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
      // Pequeña mejora: No usar alert nativo si podemos evitarlo, 
      // pero por ahora lo dejamos como fallback seguro.
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
        if (this.edicion || !this.router.url.includes('/registro')) {
           this.uS.list().subscribe((data) => {
            this.uS.setList(data);
            this.isSaving = false;
            this.router.navigate(['usuarios']); 
          });
        } 
        else {
          this.isSaving = false;
          alert('¡Registro exitoso! Por favor inicia sesión.');
          this.router.navigate(['login']); 
        }
      },
      error: (err) => {
        console.error(err);
        this.isSaving = false;
        alert('Ocurrió un error al registrar/actualizar el usuario.');
      },
    });
  }

  cancel(): void {
    if (this.router.url.includes('/registro')) {
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
        this.form.get('fechaRegistro')?.disable();
      });
    }
  }
}