import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Params, Router } from '@angular/router';

// Modelos
import { Disponibilidad } from '../../../models/disponibilidad';
import { ProfesionalServicio } from '../../../models/profesionalservicio';

// Servicios
import { Disponibilidadservice } from '../../../services/disponibilidadservice';
import { Profesionalservicioservice } from '../../../services/profesionalservicioservice';
import { Loginservice } from '../../../services/loginservice';
import { Usuarioservice } from '../../../services/usuarioservice';

@Component({
  selector: 'app-disponibilidadinsert',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule, MatFormFieldModule, 
    MatButtonModule, MatInputModule, MatSelectModule, MatIconModule
  ],
  templateUrl: './disponibilidadinsert.html',
  styleUrl: './disponibilidadinsert.css',
})
export class Disponibilidadinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  disp: Disponibilidad = new Disponibilidad();
  id: number = 0;
  edicion: boolean = false;
  
  // CAMBIO: Ahora es una lista para que el usuario elija
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
    // CAMBIO: Agregamos idProfesionalServicio al formulario visible
    this.form = this.formBuilder.group({
      disponibilidadId: [''],
      idProfesionalServicio: ['', Validators.required], // El usuario debe elegir uno
      diaSemana: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    // Cargamos la lista de servicios del doctor logueado
    this.cargarMisServicios();
  }

  cargarMisServicios() {
    const email = this.loginService.getUsername();
    if (email) {
        this.uS.listByEmail(email).subscribe({
            next: (myUser) => {
                if (myUser) {
                    // Buscamos TODOS los servicios de este usuario
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
      
      // CAMBIO: Tomamos el valor que el usuario eligió en el Select
      this.disp.idProfesionalServicio = this.form.value.idProfesionalServicio;

      const request = this.edicion ? this.dS.update(this.disp) : this.dS.insert(this.disp);
      
      request.subscribe(() => {
          this.dS.list().subscribe(data => this.dS.setList(data));
          this.router.navigate(['disponibilidades']);
      });
    }
  }

  init() {
    if (this.edicion) {
      this.dS.listId(this.id).subscribe((data) => {
        this.form.setValue({
          disponibilidadId: data.disponibilidadId,
          // Al editar, pre-seleccionamos el servicio que ya tenía este horario
          idProfesionalServicio: data.idProfesionalServicio, 
          diaSemana: data.diaSemana,
          horaInicio: data.horaInicio ? data.horaInicio.substring(0, 5) : '',
          horaFin: data.horaFin ? data.horaFin.substring(0, 5) : ''
        });
      });
    }
  }
}