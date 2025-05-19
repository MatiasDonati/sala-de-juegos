import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userEmail: string | null = null;
  mostrarLoginRegister: boolean = false;
  title = 'Sala de Juegos';
  
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * En el `ngOnInit`, consultamos al servicio si hay un usuario logueado.
   */
  async ngOnInit() {
    await this.verificarUsuario();
  }

  /**
   * Verifica si hay usuario logueado y actualiza el estado del header.
   */
  async verificarUsuario() {
    try {
      this.userEmail = await this.authService.obtenerUsuarioActual();
      this.mostrarLoginRegister = !this.userEmail;
    } catch (err) {
      console.error('Error al verificar el usuario:', err);
      this.mostrarLoginRegister = true;
    }
  }

  /**
   * Cierra la sesión y redirige al login.
   */
  async cerrarSesion() {
    try {
      await this.authService.cerrarSesion();
      this.userEmail = null;
      this.mostrarLoginRegister = true;
      this.router.navigate(['/login']);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
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

  irAlChat() {
    this.router.navigate(['/chat']);
  }
}
