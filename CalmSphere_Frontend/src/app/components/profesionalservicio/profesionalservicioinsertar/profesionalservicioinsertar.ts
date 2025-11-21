import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProfesionalServicio } from '../../../models/profesionalservicio';
import { Profesionalservicioservice } from '../../../services/profesionalservicioservice';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-profesionalservicioinsertar',
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
      id: [''],
      nombre: ['', Validators.required],
      duracionMin: ['', Validators.required],
      precioBase: ['', Validators.required],
      idDisponibilidad: ['', Validators.required],
      idUsuario: ['', Validators.required],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.ps.idProfesionalServicio = this.form.value.id;
      this.ps.nombre = this.form.value.nombre;
      this.ps.duracionMin = this.form.value.duracionMin;
      this.ps.precioBase = this.form.value.precioBase;
      this.ps.idDisponibilidad = this.form.value.idDisponibilidad;
      this.ps.idUsuario = this.form.value.idUsuario;

      if (this.edicion) {
        this.psS.update(this.ps).subscribe(() => {
          this.psS.list().subscribe((data) => {
            this.psS.setList(data);
          });
        });
      } else {
        this.psS.insert(this.ps).subscribe(() => {
          this.psS.list().subscribe((data) => {
            this.psS.setList(data);
          });
        });
      }
      this.router.navigate(['profesional-servicios']);
    }
  }

  init() {
    if (this.edicion) {
      this.psS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          id: new FormControl(data.idProfesionalServicio),
          nombre: new FormControl(data.nombre),
          duracionMin: new FormControl(data.duracionMin),
          precioBase: new FormControl(data.precioBase),
          idDisponibilidad: new FormControl(data.idDisponibilidad),
          idUsuario: new FormControl(data.idUsuario),
        });
      });
    }
  }
}