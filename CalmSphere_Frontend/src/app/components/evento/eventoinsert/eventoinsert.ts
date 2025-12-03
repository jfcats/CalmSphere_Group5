import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { StripeCardComponent, NgxStripeModule, StripeService } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';

import { MetodoPago } from '../../../models/metodopago';
import { Disponibilidad } from '../../../models/disponibilidad';

import { Eventoservice } from '../../../services/eventoservice';
import { Profesionalservicioservice } from '../../../services/profesionalservicioservice';
import { Metodopagoservice } from '../../../services/metodopagoservice';
import { Loginservice } from '../../../services/loginservice';
import { Usuarioservice } from '../../../services/usuarioservice';
import { Disponibilidadservice } from '../../../services/disponibilidadservice';

@Component({
  selector: 'app-eventoinsert',
  standalone: true,
  imports: [
    MatFormFieldModule, ReactiveFormsModule, MatButtonModule, 
    MatInputModule, MatSelectModule, CommonModule, MatDatepickerModule, 
    MatNativeDateModule, NgxStripeModule, MatIconModule, MatCheckboxModule, RouterModule
  ],
  templateUrl: './eventoinsert.html',
  styleUrl: './eventoinsert.css',
})
export class Eventoinsert implements OnInit {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

  form: FormGroup = new FormGroup({});
  id: number = 0;
  edicion: boolean = false;
  loading: boolean = false;

  // Datos
  todosLosServicios: any[] = []; 
  listaProfesionales: any[] = [];
  serviciosDelDoctor: any[] = [];
  listaPagos: MetodoPago[] = [];
  
  // Disponibilidad
  diasDisponibles: number[] = []; 
  horariosDisponiblesDelDoctor: Disponibilidad[] = [];
  slotsDeTiempo: string[] = []; 
  servicioSeleccionado: any = null;

  // UI
  pagarAhora: boolean = false;
  mostrarStripe: boolean = false;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#4f46e5',
        color: '#31325F',
        fontWeight: '400',
        fontFamily: '"Inter", sans-serif',
        fontSize: '16px',
        '::placeholder': { color: '#aab7c4' }
      }
    },
    hidePostalCode: true
  };
  elementsOptions: StripeElementsOptions = { locale: 'es' };

  constructor(
    private eS: Eventoservice,
    private psS: Profesionalservicioservice,
    private mpS: Metodopagoservice,
    private uS: Usuarioservice,
    private dS: Disponibilidadservice,
    private loginService: Loginservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private stripeService: StripeService
  ) {}

  ngOnInit(): void {
    // 1. Inicializar Formulario
    this.form = this.formBuilder.group({
      id: [''],
      idUsuario: ['', Validators.required],
      idDoctorSeleccionado: ['', Validators.required], 
      idProfesionalServicio: [{value: '', disabled: true}, Validators.required], 
      fecha: ['', Validators.required],
      horaInicio: ['', Validators.required],
      motivo: ['', Validators.required],
      idMetodoPago: [''], 
      monto: [{value: '', disabled: true}, Validators.required],
      pagarAhoraCheck: [false]
    });

    // 2. Cargar Listas y luego verificar parámetros
    this.cargarListasMaestras().then(() => {
        this.route.params.subscribe((data: Params) => {
          this.id = data['id'];
          this.edicion = data['id'] != null;
          
          if (this.edicion) {
            this.cargarDatosParaEditar();
          } else {
            this.detectarPaciente();
          }
        });
    });
  }

  // Promise para asegurar que los selects tengan opciones antes de setear valores
  cargarListasMaestras(): Promise<void> {
    return new Promise((resolve) => {
        let cargas = 0;
        const totalCargas = 2; // Servicios y Pagos
        const check = () => { cargas++; if(cargas >= totalCargas) resolve(); };

        this.psS.list().subscribe({
          next: (data) => {
            this.todosLosServicios = data;
            const mapDoctores = new Map();
            data.forEach((s: any) => {
              if (s.idUsuario && !mapDoctores.has(s.idUsuario)) {
                mapDoctores.set(s.idUsuario, {
                  id: s.idUsuario,
                  nombreCompleto: s.nombreProfesional ? `${s.nombreProfesional} ${s.apellidoProfesional || ''}` : 'Doctor'
                });
              }
            });
            this.listaProfesionales = Array.from(mapDoctores.values());
            check();
          },
          error: () => check()
        });

        this.mpS.list().subscribe({
          next: (data) => {
            this.listaPagos = data.filter(m => m.estado === true);
            check();
          },
          error: () => check()
        });
    });
  }

  // --- LÓGICA DE EDICIÓN ---
  cargarDatosParaEditar() {
    this.eS.listId(this.id).subscribe(data => {
      
      // 1. Encontrar el doctor asociado al servicio de la cita
      const servicio = this.todosLosServicios.find(s => s.idProfesionalServicio === data.idProfesionalServicio);
      const idDoctor = servicio ? servicio.idUsuario : null;

      // 2. Parsear Fecha y Hora
      // El backend manda "2025-12-08T19:00:00"
      const fechaObj = new Date(data.inicio);
      const horaStr = data.inicio.split('T')[1].substring(0, 5); // "19:00"

      // 3. Preparar selects dependientes
      if (idDoctor) {
          this.serviciosDelDoctor = this.todosLosServicios.filter(s => s.idUsuario === idDoctor);
          // Forzamos el slot de tiempo actual en la lista para que no salga vacío
          this.slotsDeTiempo = [horaStr]; 
      }

      // 4. Rellenar el formulario
      this.form.patchValue({
        id: data.idEvento,
        idUsuario: data.idUsuario,
        idDoctorSeleccionado: idDoctor,
        idProfesionalServicio: data.idProfesionalServicio,
        fecha: fechaObj,
        horaInicio: horaStr,
        motivo: data.motivo,
        monto: data.monto,
        idMetodoPago: data.idMetodoPago
      });

      // 5. BLOQUEAR CAMPOS (UX: Solo editable el motivo)
      this.form.get('idDoctorSeleccionado')?.disable();
      this.form.get('idProfesionalServicio')?.disable();
      this.form.get('fecha')?.disable();
      this.form.get('horaInicio')?.disable();
      this.form.get('pagarAhoraCheck')?.disable(); 
      this.form.get('idMetodoPago')?.disable();
      
      this.form.get('motivo')?.enable(); // Asegurar que motivo sí se pueda tocar
    });
  }

  detectarPaciente() {
    const email = this.loginService.getUsername();
    if(email) {
      this.uS.listByEmail(email).subscribe(u => {
        this.form.patchValue({ idUsuario: u.idUsuario });
      });
    }
  }

  // --- TEXTOS DINÁMICOS ---
  get titulo(): string {
    return this.edicion ? 'Editar Cita' : 'Reservar Cita';
  }

  get subtitulo(): string {
    return this.edicion 
      ? 'Modifica los detalles de tu sesión. Solo el motivo es editable.' 
      : 'Agenda tu sesión con nuestros especialistas.';
  }

  get botonTexto(): string {
    if (this.edicion) return 'Guardar Cambios';
    return this.pagarAhora ? 'Pagar y Reservar' : 'Confirmar Reserva';
  }

  // --- MÉTODOS AUXILIARES ---
  
  alElegirDoctor(idDoctor: number) {
    this.serviciosDelDoctor = this.todosLosServicios.filter(s => s.idUsuario === idDoctor);
    this.form.get('idProfesionalServicio')?.enable();
    this.form.get('idProfesionalServicio')?.setValue('');
    this.form.patchValue({ monto: '', horaInicio: '' }); 
    this.slotsDeTiempo = []; 
    this.cargarDisponibilidadDoctor(idDoctor);
  }

  alElegirServicio(idServicio: number) {
    this.servicioSeleccionado = this.serviciosDelDoctor.find(s => s.idProfesionalServicio === idServicio);
    if(this.servicioSeleccionado) {
      this.form.patchValue({ monto: this.servicioSeleccionado.precioBase });
      const fechaActual = this.form.get('fecha')?.value;
      if (fechaActual) {
        this.generarHorariosParaFecha(fechaActual);
      }
    }
  }

  cargarDisponibilidadDoctor(idDoctor: number) {
    this.dS.list().subscribe(all => {
       const idsServiciosDoctor = this.serviciosDelDoctor.map(s => s.idProfesionalServicio);
       this.horariosDisponiblesDelDoctor = all.filter(d => 
         idsServiciosDoctor.includes(d.idProfesionalServicio)
       );
       this.diasDisponibles = [...new Set(this.horariosDisponiblesDelDoctor.map(h => h.diaSemana))];
    });
  }

  filtroFechas = (d: Date | null): boolean => {
    if (!d || this.diasDisponibles.length === 0) return false;
    const dia = d.getDay() || 7; 
    return this.diasDisponibles.includes(dia);
  };

  alCambiarFecha(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.generarHorariosParaFecha(event.value);
    }
  }

  generarHorariosParaFecha(fecha: Date) {
    this.slotsDeTiempo = [];
    const diaSemana = fecha.getDay() || 7;
    const idServicioActual = this.form.get('idProfesionalServicio')?.value;

    if (!idServicioActual) return;

    const disponibilidades = this.horariosDisponiblesDelDoctor.filter(
      d => d.diaSemana === diaSemana && d.idProfesionalServicio === idServicioActual
    );

    const duracion = this.servicioSeleccionado?.duracionMin || 60;

    disponibilidades.forEach(disp => {
      const inicioParts = disp.horaInicio.split(':');
      const finParts = disp.horaFin.split(':');
      let inicioMin = parseInt(inicioParts[0]) * 60 + parseInt(inicioParts[1]);
      let finMin = parseInt(finParts[0]) * 60 + parseInt(finParts[1]);

      while (inicioMin + duracion <= finMin) {
        const h = Math.floor(inicioMin / 60);
        const m = inicioMin % 60;
        const slot = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        this.slotsDeTiempo.push(slot);
        inicioMin += duracion;
      }
    });
    this.slotsDeTiempo.sort();
  }

  togglePago(checked: boolean) {
    this.pagarAhora = checked;
    const controlMetodo = this.form.get('idMetodoPago');
    if(checked) {
      controlMetodo?.setValidators(Validators.required);
    } else {
      controlMetodo?.clearValidators();
      controlMetodo?.setValue('');
    }
    controlMetodo?.updateValueAndValidity();
  }

  verificarMetodoPago(idMetodo: number) {
    const metodo = this.listaPagos.find(m => m.idMetodoPago === idMetodo);
    this.mostrarStripe = metodo ? metodo.nombre.toLowerCase().includes('tarjeta') : false;
  }

  aceptar(): void {
    if (this.form.invalid) return;
    this.loading = true;

    // Si es edición, ignoramos Stripe en esta pantalla
    if (this.edicion) {
        this.guardarCita(''); 
        return;
    }

    if (this.pagarAhora && this.mostrarStripe) {
      this.stripeService.createToken(this.card.element).subscribe((result) => {
        if (result.token) {
          this.guardarCita(result.token.id);
        } else { 
          this.loading = false; 
          alert(result.error?.message || "Error procesando tarjeta"); 
        }
      });
    } else {
      this.guardarCita(''); 
    }
  }

  guardarCita(tokenPago: string) {
    const formValue = this.form.getRawValue();

    // Reconstruimos la fecha solo para cumplir con el formato (aunque el backend ignore en update)
    const fechaBase = new Date(formValue.fecha); 
    const [hora, min] = formValue.horaInicio.split(':');
    fechaBase.setHours(Number(hora), Number(min), 0);
    
    const datosReales = {
        idEvento: this.edicion ? this.id : 0,
        idUsuario: Number(formValue.idUsuario),
        idProfesionalServicio: Number(formValue.idProfesionalServicio),
        idMetodoPago: this.pagarAhora ? Number(formValue.idMetodoPago) : 1,
        
        inicio: this.toLocalISO(fechaBase),
        fin: this.toLocalISO(new Date(fechaBase.getTime() + 60*60000)), // Dummy end
        monto: String(formValue.monto), 
        
        estado: true,
        pagado: !!tokenPago,
        motivo: formValue.motivo,
        tokenPago: tokenPago 
    };

    const request = this.edicion 
        ? this.eS.update(datosReales) 
        : this.eS.insert(datosReales);

    request.subscribe({
      next: () => {
        const msg = this.edicion ? "Cita actualizada correctamente." : "Cita reservada con éxito.";
        alert(msg);
        this.router.navigate(['eventos']);
      },
      error: (err) => {
        this.loading = false;
        console.error("Error backend:", err);
        alert("Error: " + (err.error?.message || "No se pudo completar la acción."));
      }
    });
  }

  toLocalISO(date: Date) {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, -1);
  }
}