import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon'; // Importante para el diseño
import { MetodoPago } from '../../../models/metodopago';
import { Metodopagoservice } from '../../../services/metodopagoservice';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-metodopagoinsert',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule
  ],
  templateUrl: './metodopagoinsert.html',
  styleUrl: './metodopagoinsert.css',
})
export class Metodopagoinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  metodo: MetodoPago = new MetodoPago();
  id: number = 0;
  edicion: boolean = false;
  isSaving: boolean = false; // Para evitar doble clic

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
      estado: [true, Validators.required], // Default Activo
    });
  }

  aceptar(): void {
    if (this.form.invalid) return;

    this.isSaving = true; // Bloqueamos botón
    this.metodo = this.form.value;

    const request = this.edicion 
      ? this.mS.update(this.metodo) 
      : this.mS.insert(this.metodo);

    request.subscribe({
      next: () => {
        this.mS.list().subscribe((data) => {
          this.mS.setList(data);
          this.isSaving = false;
          this.router.navigate(['metodopagos']);
        });
      },
      error: (err) => {
        console.error('Error:', err);
        this.isSaving = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['metodopagos']);
  }

  init() {
    if (this.edicion) {
      this.mS.listId(this.id).subscribe((data) => {
        this.form.patchValue(data);
      });
    }
  }

  // Getters para textos dinámicos (Igual que en Usuario)
  get titulo(): string {
    return this.edicion ? 'Editar Método' : 'Nuevo Método de Pago';
  }

  get subtitulo(): string {
    return this.edicion 
      ? 'Modifica los detalles del método de pago.' 
      : 'Registra una nueva forma de pago para las citas.';
  }

  get textoBoton(): string {
    return this.edicion ? 'Guardar Cambios' : 'Registrar Método';
  }
}