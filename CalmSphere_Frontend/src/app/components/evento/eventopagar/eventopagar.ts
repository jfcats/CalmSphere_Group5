import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxStripeModule, StripeCardComponent, StripeService } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { Eventoservice } from '../../../services/eventoservice';
import { Evento } from '../../../models/evento';

@Component({
  selector: 'app-eventopagar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, NgxStripeModule],
  templateUrl: './eventopagar.html',
  styleUrl: './eventopagar.css'
})
export class Eventopagar implements OnInit {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

  idEvento: number = 0;
  evento: Evento = new Evento();
  loading = false;

  // Configuración Stripe
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
    private route: ActivatedRoute,
    private router: Router,
    private eS: Eventoservice,
    private stripeService: StripeService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idEvento = params['id'];
      this.cargarEvento();
    });
  }

  cargarEvento() {
    this.eS.listId(this.idEvento).subscribe(data => {
      this.evento = data;
      // Validación extra: Si ya está pagado, sacar al usuario
      if(this.evento.pagado) {
        alert("Esta cita ya está pagada.");
        this.router.navigate(['eventos']);
      }
    });
  }

  procesarPago() {
    this.loading = true;
    this.stripeService.createToken(this.card.element).subscribe((result) => {
      if (result.token) {
        // Aquí llamamos a la actualización con el token
        this.confirmarPagoEnBackend(result.token.id);
      } else {
        this.loading = false;
        alert(result.error?.message || "Error en tarjeta");
      }
    });
  }

confirmarPagoEnBackend(token: string) {
    // YA NO usamos 'update', usamos el endpoint específico de pago
    this.eS.pagar(this.idEvento, token).subscribe({
      next: (resp) => {
        // La respuesta del backend es un mensaje de éxito
        console.log("Respuesta backend:", resp); 
        alert("¡Pago Exitoso! Cita confirmada.");
        this.router.navigate(['eventos']);
      },
      error: (err) => {
        this.loading = false;
        console.error("Error backend:", err);
        // Manejo de errores más amigable
        const mensaje = err.error || "Error al procesar el pago en el servidor.";
        alert(mensaje);
      }
    });
  }
  
  cancelar() {
    this.router.navigate(['eventos']);
  }
}