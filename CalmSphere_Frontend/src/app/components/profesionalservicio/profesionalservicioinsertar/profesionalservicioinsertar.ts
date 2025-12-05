import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProfesionalServicio } from '../../../models/profesionalservicio';
import { Profesionalservicioservice } from '../../../services/profesionalservicioservice';
import { Loginservice } from '../../../services/loginservice';
import { Usuarioservice } from '../../../services/usuarioservice';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profesionalservicioinsertar',
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatInputModule, RouterLink],
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
    // CORRECCIÓN: Quitamos Validators.required de idUsuario para no bloquear el botón
    this.form = this.formBuilder.group({
      id: [''],
      nombre: ['', Validators.required],
      duracionMin: ['', Validators.required],
      precioBase: ['', Validators.required],
      idUsuario: [''], // Sin validador, lo controlamos en 'aceptar'
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    if (!this.edicion) {
      this.detectarUsuario();
    }
  }

  detectarUsuario() {
      const email = this.loginService.getUsername();
      if (email) {
        // CAMBIO: Usamos listByEmail en lugar de traer toda la lista
        this.uS.listByEmail(email).subscribe({
          next: (myUser) => {
            if (myUser) {
              this.form.patchValue({ idUsuario: myUser.idUsuario });
              // El campo está oculto en el HTML, así que ya está listo.
            }
          },
          error: (err) => {
            console.error("No se pudo obtener el usuario por email", err);
          }
        });
      }
    }

  aceptar(): void {
    if (this.form.valid) {
      // Validamos manualmente que el usuario se haya detectado
      const usuarioDetectado = this.form.value.idUsuario;
      
      if (!usuarioDetectado && !this.edicion) {
        alert("Error: No se pudo identificar tu usuario. Por favor recarga la página.");
        return;
      }

      this.ps.idProfesionalServicio = this.form.value.id;
      this.ps.nombre = this.form.value.nombre;
      this.ps.duracionMin = this.form.value.duracionMin;
      this.ps.precioBase = this.form.value.precioBase;
      this.ps.idUsuario = usuarioDetectado;

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
          idUsuario: data.idUsuario
        });
      });
    }
  }
}