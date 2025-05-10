import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { createClient, User } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qzmlctjhmeozqhvsffde.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bWxjdGpobWVvenFodnNmZmRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMTIwMTQsImV4cCI6MjA2MTU4ODAxNH0.iqsEoW-qpTMjcdYTeVLb5dqocFIIWHiNTL8OdDkCqDM'
);

@Component({
  selector: 'app-header',
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  userInfo: User | null = null;
  
  title = 'Sala de Juegos';

  constructor(private router: Router) {}

  ngOnInit() {
    this.obtenerUsuario();
  }
    async obtenerUsuario() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error al obtener usuario:', error);
      console.log('Emitido desde HomeComponent: null');
      return;
    }
    this.userInfo = data.user;
    console.log('Emitido desde HomeComponent:', this.userInfo);
  }

  cerrarSesion() {
    supabase.auth.signOut()
      .then(() => {
        this.userInfo = null;
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  }
  
  irAHome() {
    this.router.navigate(['/home']);
  }
  irAQuienSoy() {
    this.router.navigate(['/quien-soy']);
  }
  irALogin() {
    this.router.navigate(['/login']);
  }
  irARegister() {
    this.router.navigate(['/register']);
}
}
