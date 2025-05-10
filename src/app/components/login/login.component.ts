import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createClient, User } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qzmlctjhmeozqhvsffde.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bWxjdGpobWVvenFodnNmZmRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMTIwMTQsImV4cCI6MjA2MTU4ODAxNH0.iqsEoW-qpTMjcdYTeVLb5dqocFIIWHiNTL8OdDkCqDM'
);

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  name: string = '';
  age: number = 0;
  avatarFile: File | null = null;
  mensaje: string = '';
  userInfo: User | null = null;


  constructor(private router: Router) {}

  login() {
    supabase.auth.signInWithPassword({
      email: this.username,
      password: this.password,
    }).then(({ data, error }) => {
      if (error) {
        this.mensaje = 'Error: ' + error.message;
        console.error(error);
      } else {
        this.mensaje = '¡Login exitoso!';
        // console.log('Login exitoso:', data);
        this.router.navigate(['/home']);
      }
    });
  }

  irARegistrarse() {
    this.router.navigate(['/register']);
  }
}
