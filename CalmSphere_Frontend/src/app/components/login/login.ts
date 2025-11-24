import { Component, OnInit } from '@angular/core';
import { Loginservice } from '../../services/loginservice';
import { Router } from '@angular/router';
import { JwtRequest } from '../../models/jwtRequest';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class Login implements OnInit {

  username: string = '';
  password: string = '';
  hidePassword: boolean = true;
  isLoading: boolean = false;

  constructor(
    private loginservice: Loginservice,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Evita usar sessionStorage en SSR
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('token');
      const jwtHelper = new JwtHelperService();
      if (token && !jwtHelper.isTokenExpired(token)) {
        // ✅ Si ya hay sesión, vete directo a eventos
        this.router.navigate(['/eventos']);
      }
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  login(): void {
    if (!this.username || !this.password) {
      alert('Ingresa usuario y contraseña');
      return;
    }

    this.isLoading = true;

    const request = new JwtRequest();
    request.username = this.username;
    request.password = this.password;

    this.loginservice.login(request).subscribe({
      next: (data: any) => {
        if (typeof window !== 'undefined' && data && data.jwttoken) {
          sessionStorage.setItem('token', data.jwttoken);
          // ✅ Redirección Angular a la lista de eventos
          this.router.navigateByUrl('/eventos');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error("ERROR LOGIN:", error);
        this.isLoading = false;
        alert("Credenciales incorrectas");
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/landing']);
  }
}
