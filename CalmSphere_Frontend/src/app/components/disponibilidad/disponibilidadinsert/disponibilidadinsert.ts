import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router'; // Agregado RouterLink

import { Disponibilidad } from '../../../models/disponibilidad';
import { ProfesionalServicio } from '../../../models/profesionalservicio';

import { Disponibilidadservice } from '../../../services/disponibilidadservice';
import { Profesionalservicioservice } from '../../../services/profesionalservicioservice';
import { Loginservice } from '../../../services/loginservice';
import { Usuarioservice } from '../../../services/usuarioservice';

@Component({
  selector: 'app-disponibilidadinsert',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule, MatFormFieldModule, 
    MatButtonModule, MatInputModule, MatSelectModule, MatIconModule, RouterLink
  ],
  templateUrl: './disponibilidadinsert.html',
  styleUrl: './disponibilidadinsert.css',
})
export class Disponibilidadinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  disp: Disponibilidad = new Disponibilidad();
  id: number = 0;
  edicion: boolean = false;
  
  misServicios: ProfesionalServicio[] = [];

  diasSemana = [
    { value: 1, viewValue: 'Lunes' }, { value: 2, viewValue: 'Martes' },
    { value: 3, viewValue: 'Miércoles' }, { value: 4, viewValue: 'Jueves' },
    { value: 5, viewValue: 'Viernes' }, { value: 6, viewValue: 'Sábado' },
    { value: 7, viewValue: 'Domingo' },
  ];

  constructor(
    private dS: Disponibilidadservice,
    private psS: Profesionalservicioservice, 
    private uS: Usuarioservice,
    private loginService: Loginservice,
    public router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      disponibilidadId: [''],
      idProfesionalServicio: ['', Validators.required],
      diaSemana: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.cargarMisServicios();
  }

  cargarMisServicios() {
    const email = this.loginService.getUsername();
    if (email) {
        this.uS.listByEmail(email).subscribe({
            next: (myUser) => {
                if (myUser) {
                    this.psS.searchByUsuario(myUser.idUsuario).subscribe(servicios => {
                        this.misServicios = servicios;
                        
                        if (this.misServicios.length === 0) {
                            alert("No tienes servicios registrados. Crea uno primero.");
                            this.router.navigate(['profesional-servicios/news']);
                        }
                    });
                }
            },
            error: (err) => console.error(err)
        });
    }
  }

  aceptar(): void {
    if (this.form.valid) {
      this.disp.disponibilidadId = this.form.value.disponibilidadId;
      this.disp.diaSemana = this.form.value.diaSemana;
      this.disp.horaInicio = this.form.value.horaInicio;
      this.disp.horaFin = this.form.value.horaFin;
      this.disp.idProfesionalServicio = this.form.value.idProfesionalServicio;

      const request = this.edicion ? this.dS.update(this.disp) : this.dS.insert(this.disp);
      
      request.subscribe(() => {
          this.dS.list().subscribe(data => this.dS.setList(data));
          this.router.navigate(['disponibilidades']);
      });
    }
  }
  
  getDiaNombre(val: number): string {
    const dia = this.diasSemana.find(d => d.value === val);
    return dia ? dia.viewValue + 's' : ''; // Retorna "Lunes", "Martes", etc.
  }

  init() {
    if (this.edicion) {
      this.dS.listId(this.id).subscribe((data) => {
        this.form.setValue({
          disponibilidadId: data.disponibilidadId,
          idProfesionalServicio: data.idProfesionalServicio, 
          diaSemana: data.diaSemana,
          horaInicio: data.horaInicio ? data.horaInicio.substring(0, 5) : '',
          horaFin: data.horaFin ? data.horaFin.substring(0, 5) : ''
        });
      });
    }
  }
}