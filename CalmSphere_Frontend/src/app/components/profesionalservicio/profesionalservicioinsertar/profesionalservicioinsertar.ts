import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProfesionalServicio } from '../../../models/profesionalservicio';
import { Profesionalservicioservice } from '../../../services/profesionalservicioservice';
import { Loginservice } from '../../../services/loginservice';
import { Usuarioservice } from '../../../services/usuarioservice';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-profesionalservicioinsertar',
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatInputModule],
  templateUrl: './profesionalservicioinsertar.html',
  styleUrl: './profesionalservicioinsertar.css',
})
export class Profesionalservicioinsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  ps: ProfesionalServicio = new ProfesionalServicio();
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private psS: Profesionalservicioservice,
    private uS: Usuarioservice,
    private loginService: Loginservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      nombre: ['', Validators.required],
      duracionMin: ['', Validators.required],
      precioBase: ['', Validators.required],
      // idDisponibilidad: ELIMINADO - Ya no existe en la entidad
      idUsuario: ['', Validators.required],
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    // Si es nuevo registro, detectamos automáticamente quién es el usuario
    if (!this.edicion) {
      this.detectarUsuario();
    }
  }

  detectarUsuario() {
    const email = this.loginService.getUsername();
    if (email) {
      this.uS.list().subscribe(users => {
        const myUser = users.find(u => u.email === email);
        if (myUser) {
          this.form.patchValue({ idUsuario: myUser.idUsuario });
          this.form.controls['idUsuario'].disable(); // Lo bloqueamos para que no se edite
        }
      });
    }
  }

  aceptar(): void {
    if (this.form.valid || (this.form.disabled && this.form.getRawValue().idUsuario)) { // Permitir disabled
      this.ps.idProfesionalServicio = this.form.value.id;
      this.ps.nombre = this.form.value.nombre;
      this.ps.duracionMin = this.form.value.duracionMin;
      this.ps.precioBase = this.form.value.precioBase;
      // Usamos getRawValue() por si el input está disabled
      this.ps.idUsuario = this.form.getRawValue().idUsuario;

      const request = this.edicion 
        ? this.psS.update(this.ps) 
        : this.psS.insert(this.ps);

      request.subscribe({
        next: () => {
          this.psS.list().subscribe((data) => {
            this.psS.setList(data);
            this.router.navigate(['profesional-servicios']);
          });
        },
        error: (err) => console.error('Error:', err)
      });
    }
  }

  init() {
    if (this.edicion) {
      this.psS.listId(this.id).subscribe((data) => {
        this.form.setValue({
          id: data.idProfesionalServicio,
          nombre: data.nombre,
          duracionMin: data.duracionMin,
          precioBase: data.precioBase,
          idUsuario: data.idUsuario // Mantenemos el usuario original
        });
        this.form.controls['idUsuario'].disable();
      });
    }
  }
}