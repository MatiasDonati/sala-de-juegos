import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule, HeaderComponent]
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  mensaje: string = '';

  constructor(private router: Router) {}

  register() {
    supabase.auth.signUp({
      email: this.email,
      password: this.password
    }).then(({ data, error }) => {
      if (error) {
        this.mensaje = 'Error al registrarse: ' + error.message;
      } else {
        this.mensaje = '¡Registro exitoso! Revisá tu correo.';
        this.router.navigate(['/login']);
      }
    });
  }
}
