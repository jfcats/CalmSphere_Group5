import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Disponibilidad } from '../../../models/disponibilidad';
import { Disponibilidadservice } from '../../../services/disponibilidadservice';
import { Profesionalservicioservice } from '../../../services/profesionalservicioservice';
import { Loginservice } from '../../../services/loginservice';
import { Usuarioservice } from '../../../services/usuarioservice';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-disponibilidadinsert',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatSelectModule, MatIconModule],
  templateUrl: './disponibilidadinsert.html',
  styleUrl: './disponibilidadinsert.css',
})
export class Disponibilidadinsert implements OnInit {
  form: FormGroup = new FormGroup({});
  disp: Disponibilidad = new Disponibilidad();
  id: number = 0;
  edicion: boolean = false;
  
  // Variable crucial: Aquí guardaremos el ID de tu servicio profesional
  idMiServicio: number = 0;

  diasSemana = [
    { value: 1, viewValue: 'Lunes' }, { value: 2, viewValue: 'Martes' },
    { value: 3, viewValue: 'Miércoles' }, { value: 4, viewValue: 'Jueves' },
    { value: 5, viewValue: 'Viernes' }, { value: 6, viewValue: 'Sábado' },
    { value: 7, viewValue: 'Domingo' },
  ];

  constructor(
    private dS: Disponibilidadservice,
    private psS: Profesionalservicioservice, // Necesario para buscar tu servicio
    private uS: Usuarioservice,
    private loginService: Loginservice,
    public router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      disponibilidadId: [''],
      diaSemana: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    // Detectamos el servicio ID inmediatamente
    this.detectarMiServicio();
  }

  detectarMiServicio() {
    const email = this.loginService.getUsername();
    if (email) {
        this.uS.list().subscribe(users => {
            const myUser = users.find(u => u.email === email);
            if (myUser) {
                this.psS.list().subscribe(servicios => {
                    const myService = servicios.find(s => s.idUsuario === myUser.idUsuario);
                    if (myService) {
                        this.idMiServicio = myService.idProfesionalServicio;
                    } else {
                        alert("Primero debes crear tu Perfil Profesional antes de asignar horarios.");
                        this.router.navigate(['profesional-servicios/news']);
                    }
                });
            }
        });
    }
  }

  aceptar(): void {
    if (this.form.valid) {
      this.disp.disponibilidadId = this.form.value.disponibilidadId;
      this.disp.diaSemana = this.form.value.diaSemana;
      this.disp.horaInicio = this.form.value.horaInicio;
      this.disp.horaFin = this.form.value.horaFin;
      
      // ASIGNACIÓN CRÍTICA:
      this.disp.idProfesionalServicio = this.idMiServicio;

      if(this.idMiServicio === 0 && !this.edicion) {
         alert("Error: No se ha identificado tu servicio profesional.");
         return;
      }

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
        // Al editar, mantenemos el ID de servicio que ya traía el objeto
        this.idMiServicio = data.idProfesionalServicio; 
        
        this.form.setValue({
          disponibilidadId: data.disponibilidadId,
          diaSemana: data.diaSemana,
          horaInicio: data.horaInicio ? data.horaInicio.substring(0, 5) : '',
          horaFin: data.horaFin ? data.horaFin.substring(0, 5) : ''
        });
      });
    }
  }
}