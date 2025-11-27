import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MetodoPago } from '../../../models/metodopago';
import { Metodopagoservice } from '../../../services/metodopagoservice';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-metodopagoinsert',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
  ],
  templateUrl: './metodopagoinsert.html',
  styleUrl: './metodopagoinsert.css',
})
export class Metodopagoinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  metodo: MetodoPago = new MetodoPago();
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private mS: Metodopagoservice,
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
      idMetodoPago: [''],
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      estado: [true, Validators.required],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.metodo.idMetodoPago = this.form.value.idMetodoPago;
      this.metodo.nombre = this.form.value.nombre;
      this.metodo.tipo = this.form.value.tipo;
      this.metodo.estado = this.form.value.estado;

      // 1. Definir la petición
      const request = this.edicion 
        ? this.mS.update(this.metodo) 
        : this.mS.insert(this.metodo);

      // 2. Ejecutar y esperar respuesta
      request.subscribe({
        next: () => {
          // 3. Navegar SOLO tras éxito
          this.mS.list().subscribe((data) => {
            this.mS.setList(data);
            this.router.navigate(['metodopagos']); // <--- Movido aquí dentro
          });
        },
        error: (err) => {
          console.error('Error al guardar método de pago:', err);
        }
      });
    }
  }

  init() {
    if (this.edicion) {
      this.mS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idMetodoPago: new FormControl(data.idMetodoPago),
          nombre: new FormControl(data.nombre),
          tipo: new FormControl(data.tipo),
          estado: new FormControl(data.estado),
        });
      });
    }
  }
}