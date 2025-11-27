import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Disponibilidad } from '../../../models/disponibilidad';
import { Disponibilidadservice } from '../../../services/disponibilidadservice';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-disponibilidadinsert',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './disponibilidadinsert.html',
  styleUrl: './disponibilidadinsert.css',
})
export class Disponibilidadinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  disp: Disponibilidad = new Disponibilidad();
  id: number = 0;
  edicion: boolean = false;

  diasSemana = [
    { value: 1, viewValue: 'Lunes' },
    { value: 2, viewValue: 'Martes' },
    { value: 3, viewValue: 'Miércoles' },
    { value: 4, viewValue: 'Jueves' },
    { value: 5, viewValue: 'Viernes' },
    { value: 6, viewValue: 'Sábado' },
    { value: 7, viewValue: 'Domingo' },
  ];

  constructor(
    private dS: Disponibilidadservice,
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
      disponibilidadId: [''],
      diaSemana: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.disp.disponibilidadId = this.form.value.disponibilidadId;
      this.disp.diaSemana = this.form.value.diaSemana;
      this.disp.horaInicio = this.form.value.horaInicio;
      this.disp.horaFin = this.form.value.horaFin;

      // 1. Definimos la petición (Update o Insert)
      const request = this.edicion 
        ? this.dS.update(this.disp) 
        : this.dS.insert(this.disp);

      // 2. Ejecutamos la petición
      request.subscribe({
        next: () => {
          // 3. Solo cuando el servidor responde OK, refrescamos y navegamos
          this.dS.list().subscribe((data) => {
            this.dS.setList(data);
            this.router.navigate(['disponibilidades']); // <--- Ahora está dentro
          });
        },
        error: (err) => {
          console.error('Error al guardar disponibilidad:', err);
        }
      });
    }
  }

  init() {
    if (this.edicion) {
      this.dS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          disponibilidadId: new FormControl(data.disponibilidadId),
          diaSemana: new FormControl(data.diaSemana),
          // cortamos a HH:mm por si viene HH:mm:ss
          horaInicio: new FormControl(
            data.horaInicio ? data.horaInicio.substring(0, 5) : ''
          ),
          horaFin: new FormControl(
            data.horaFin ? data.horaFin.substring(0, 5) : ''
          ),
        });
      });
    }
  }
}