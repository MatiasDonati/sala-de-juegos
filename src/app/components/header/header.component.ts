import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { createClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

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
  mostrarLoginRegister: boolean = false; // Arranca en false
  title = 'Sala de Juegos';
  
  constructor(private router: Router) {}

  async ngOnInit() {
    await this.obtenerUsuario();
  }

  async obtenerUsuario() {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        this.mostrarLoginRegister = true;
        this.usuarioLogueado.emit(null);
        return;
      }

      this.userInfo = data.user;
      this.mostrarLoginRegister = !this.userInfo;  // true si no hay userInfo, false si hay userInfo
      const email = this.userInfo ? this.userInfo.email : null;
      this.usuarioLogueado.emit(email);
    } catch (err) {
      console.error('Error al obtener usuario:', err);
      this.mostrarLoginRegister = true;
      this.usuarioLogueado.emit(null);
    }
  }

  cerrarSesion() {
    supabase.auth.signOut()
      .then(() => {
        this.userInfo = null;
        this.mostrarLoginRegister = true;  // Al cerrar sesión, mostramos Login y Register
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
