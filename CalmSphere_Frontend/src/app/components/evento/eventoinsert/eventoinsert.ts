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
  
  // Slots
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
    this.cargarDatosIniciales();

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

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      if (!this.edicion) this.detectarPaciente();
    });
  }

  cargarDatosIniciales() {
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
      },
      error: (e) => console.error("Error cargando servicios:", e)
    });

    this.mpS.list().subscribe(data => {
      this.listaPagos = data.filter(m => m.estado === true);
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

  // --- LÓGICA FINAL CONECTADA CON FORMULARIO REAL ---
  guardarCita(tokenPago: string) {
    const formValue = this.form.getRawValue();

    // 1. Calcular Fechas Reales
    const fechaBase = formValue.fecha; 
    const [hora, min] = formValue.horaInicio.split(':');
    
    const fechaInicio = new Date(fechaBase);
    fechaInicio.setHours(Number(hora), Number(min), 0);
    
    const duracion = this.servicioSeleccionado?.duracionMin || 60;
    const fechaFin = new Date(fechaInicio.getTime() + duracion * 60000); // Sumar minutos

    // Función para formato "2025-12-08T19:00:00"
    const toLocalISO = (date: Date) => {
        const tzOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - tzOffset).toISOString().slice(0, -1);
    };

    // 2. Determinar método de pago
    let metodoPagoId = 1; // Default: Pendiente/Efectivo
    if (this.pagarAhora) {
        metodoPagoId = Number(formValue.idMetodoPago);
    }

    // 3. Crear Objeto Plano (NÚMEROS y STRINGS)
    const datosReales = {
        idEvento: 0,
        
        // IDs como NÚMEROS (Integer en Java)
        idUsuario: Number(formValue.idUsuario),
        idProfesionalServicio: Number(formValue.idProfesionalServicio),
        idMetodoPago: metodoPagoId,
        
        // Fechas y Monto como STRINGS (Para evitar error de parseo)
        inicio: toLocalISO(fechaInicio),
        fin: toLocalISO(fechaFin),
        monto: String(formValue.monto), 
        
        estado: true,
        motivo: formValue.motivo,
        tokenPago: tokenPago 
    };

    console.log("ENVIANDO DATOS REALES:", datosReales);

    this.eS.insert(datosReales).subscribe({
      next: () => {
        alert(tokenPago ? "¡Pago procesado con éxito!" : "Cita reservada correctamente.");
        this.router.navigate(['eventos']);
      },
      error: (err) => {
        this.loading = false;
        console.error("Error backend:", err);
        const msg = typeof err.error === 'string' ? err.error : err.error?.message;
        alert("Error: " + (msg || "No se pudo reservar la cita."));
      }
    });
  }
}