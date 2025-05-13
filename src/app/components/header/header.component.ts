import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { createClient, User } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qzmlctjhmeozqhvsffde.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bWxjdGpobWVvenFodnNmZmRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMTIwMTQsImV4cCI6MjA2MTU4ODAxNH0.iqsEoW-qpTMjcdYTeVLb5dqocFIIWHiNTL8OdDkCqDM'
);

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() usuarioLogueado = new EventEmitter<string | null>();
  userInfo: User | null = null;
  title = 'Sala de Juegos';
  
  constructor(private router: Router) {}

  async ngOnInit() {
    await this.obtenerUsuario();
  }

  async obtenerUsuario() {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        // console.error('Error al obtener usuario:', error);
        this.usuarioLogueado.emit(null);
        return;
      }

      this.userInfo = data.user;
      const email = this.userInfo ? this.userInfo.email : null;
      this.usuarioLogueado.emit(email);
    } catch (err) {
      console.error('Error al obtener usuario:', err);
      this.usuarioLogueado.emit(null);
    }
  }

  cerrarSesion() {
    supabase.auth.signOut()
      .then(() => {
        this.userInfo = null;
        this.usuarioLogueado.emit(null);
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