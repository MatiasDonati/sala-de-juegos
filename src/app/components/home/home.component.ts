import { NgIf } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, User } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qzmlctjhmeozqhvsffde.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bWxjdGpobWVvenFodnNmZmRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMTIwMTQsImV4cCI6MjA2MTU4ODAxNH0.iqsEoW-qpTMjcdYTeVLb5dqocFIIWHiNTL8OdDkCqDM'
);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userInfo: User | null = null;

  @Output() usuarioLogueado = new EventEmitter<User | null>();

  constructor(private router: Router) {}

  ngOnInit() {
    this.obtenerUsuario();
  }

  async obtenerUsuario() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error al obtener usuario:', error);
      this.usuarioLogueado.emit(null);  // Emitimos null si hay error
      console.log('Emitido desde HomeComponent: null');
      return;
    }

    this.userInfo = data.user;
    this.usuarioLogueado.emit(this.userInfo); // Emitimos el usuario logueado
    console.log('Emitido desde HomeComponent:', this.userInfo);

  }

  cerrarSesion() {
    supabase.auth.signOut()
      .then(() => {
        this.userInfo = null;
        this.usuarioLogueado.emit(null); // Emitimos null al cerrar sesión
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  }

  jugarAhorcado() {
    console.log('Ahorcado');
  }

  jugarMayorMenor() {
    console.log('Mayor o Menor');
  }

  jugarPreguntados() {
    console.log('Preguntados');
  }

  jugarMiJuego() {
    console.log('Mi Juego');
  }
}
