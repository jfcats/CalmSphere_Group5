import { Component } from '@angular/core';
import { Loginservice } from '../../services/loginservice';
import { Router } from '@angular/router';
import { JwtRequest } from '../../models/jwtRequest';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
export class Login {

  username: string = '';
  password: string = '';
  hidePassword: boolean = true;
  isLoading: boolean = false;

  constructor(private loginservice: Loginservice, private router: Router) {}

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  login(): void {

    console.log("HIZO CLICK EN LOGIN"); // 👈 prueba básica

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

        console.log("RESPUESTA DEL BACK:", data); // 👈 Debug

       if (data && data.jwttoken) {
        sessionStorage.setItem('token', data.jwttoken);
      }

        this.isLoading = false;
        this.router.navigate(['/eventos']);
      },
      error: (error) => {
        console.error("ERROR LOGIN:", error);
        this.isLoading = false;
        alert("Credenciales incorrectas");
      }
    });
  }
}
