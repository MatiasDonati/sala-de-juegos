import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createClient } from '@supabase/supabase-js';
import { HeaderComponent } from '../header/header.component';

const supabase = createClient(
  'https://qzmlctjhmeozqhvsffde.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bWxjdGpobWVvenFodnNmZmRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMTIwMTQsImV4cCI6MjA2MTU4ODAxNH0.iqsEoW-qpTMjcdYTeVLb5dqocFIIWHiNTL8OdDkCqDM'
);

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  mensaje: string = '';

  constructor(private router: Router) {}

  login() {
    if (!this.username || !this.password) {
      this.mensaje = 'Todos los campos son obligatorios';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.username)) {
      this.mensaje = 'Formato de email incorrecto';
      return;
    }

    if (this.password.length < 6) {
      this.mensaje = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    supabase.auth.signInWithPassword({
      email: this.username,
      password: this.password,
    }).then(({ data, error }) => {
      if (error) {
        this.mensaje = 'Error: ' + error.message;
        console.error('Error en el login:', error);
      } else {
        this.mensaje = '';
        console.log('Usuario logueado:', data);
        this.router.navigate(['/home']);
      }
    }).catch((err) => {
      console.error('Error en la conexión:', err);
      this.mensaje = 'Error en la conexión';
    });
  }

  irARegistrarse() {
    this.router.navigate(['/register']);
  }
}
