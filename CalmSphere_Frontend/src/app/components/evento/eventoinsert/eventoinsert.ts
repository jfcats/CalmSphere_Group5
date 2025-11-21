import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Evento } from '../../../models/evento';
import { Eventoservice } from '../../../services/eventoservice';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-eventoinsert',
  imports: [MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatRadioModule],
  templateUrl: './eventoinsert.html',
  styleUrl: './eventoinsert.css',
})
export class Eventoinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  eve: Evento = new Evento();
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private eS: Eventoservice,
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
      idUsuario: ['', Validators.required],
      idProfesionalServicio: ['', Validators.required],
      idMetodoPago: ['', Validators.required],
      inicio: ['', Validators.required],
      fin: ['', Validators.required],
      estado: [true, Validators.required],
      motivo: ['', Validators.required],
      monto: ['', Validators.required],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.eve.idEvento = this.form.value.id;
      this.eve.idUsuario = this.form.value.idUsuario;
      this.eve.idProfesionalServicio = this.form.value.idProfesionalServicio;
      this.eve.idMetodoPago = this.form.value.idMetodoPago;
      this.eve.inicio = this.form.value.inicio;
      this.eve.fin = this.form.value.fin;
      this.eve.estado = this.form.value.estado;
      this.eve.motivo = this.form.value.motivo;
      this.eve.monto = this.form.value.monto;

      if (this.edicion) {
        this.eS.update(this.eve).subscribe(() => {
          this.eS.list().subscribe((data) => {
            this.eS.setList(data);
          });
        });
      } else {
        this.eS.insert(this.eve).subscribe(() => {
          this.eS.list().subscribe((data) => {
            this.eS.setList(data);
          });
        });
      }
      this.router.navigate(['eventos']);
    }
  }

  init() {
    if (this.edicion) {
      this.eS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          id: new FormControl(data.idEvento),
          idUsuario: new FormControl(data.idUsuario),
          idProfesionalServicio: new FormControl(data.idProfesionalServicio),
          idMetodoPago: new FormControl(data.idMetodoPago),
          inicio: new FormControl(data.inicio),
          fin: new FormControl(data.fin),
          estado: new FormControl(data.estado),
          motivo: new FormControl(data.motivo),
          monto: new FormControl(data.monto),
        });
      });
    }
  }
}