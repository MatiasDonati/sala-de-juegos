import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { NgFor, NgIf } from '@angular/common';
import { palabras } from './array-de-palabras';
import { AuthService } from '../../../services/auth.service';
import { SupabaseService } from '../../../services/supabase.service';
import { Router } from '@angular/router';

interface Puntaje {
  email: string;
  puntos: number;
}


@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css'],
  imports: [HeaderComponent, NgFor, NgIf]
})
export class AhorcadoComponent {
  palabra = this.obtenerPalabraAleatoria();
  palabraSecreta: string[] = [];
  letrasFallidas: string[] = [];
  intentosRestantes: number = 6;
  abecedario: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  imagenAhorcado: string = '';
  juegoTerminado: boolean = false;
  juegoGanado: boolean = false;
  juegoPerdido: boolean = false;

  usuarioEmail: string | null = null;
  puntos: number = 0;
  cuentaRegresiva: number = 0;

  tablaPuntajes: string = 'puntajes-ahorcado';

  puntajes: Puntaje[] = [];
  mostrarRanking: boolean = false;


  constructor(
    private authService: AuthService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.inicializarJuego();
    this.obtenerUsuario();
  }

  async obtenerUsuario(): Promise<void> {
    try {
      this.usuarioEmail = await this.authService.obtenerUsuarioActual();
      console.log('Usuario logueado:', this.usuarioEmail);
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  }

inicializarJuego(reiniciarIntentos: boolean = true): void {
    this.palabra = this.obtenerPalabraAleatoria();
    console.log(this.palabra);
    this.palabraSecreta = Array(this.palabra.length).fill('_');
    this.letrasFallidas = [];
    if (reiniciarIntentos) {
      this.intentosRestantes = 6;
    }    
    this.juegoTerminado = false;
    this.juegoGanado = false;
    this.juegoPerdido = false;
    this.actualizarImagen();
  }

  verificarLetra(letra: string): void {
    if (this.juegoTerminado) return;

    if (
      this.intentosRestantes > 0 &&
      !this.palabraSecreta.includes(letra) &&
      !this.letrasFallidas.includes(letra)
    ) {
      if (this.palabra.includes(letra)) {
        for (let i = 0; i < this.palabra.length; i++) {
          if (this.palabra[i] === letra) {
            this.palabraSecreta[i] = letra;
          }
        }
      } else {
        this.letrasFallidas.push(letra);
        this.intentosRestantes--;
      }
      this.actualizarImagen();
    }

    this.verificarEstadoJuego();
  }

  async verificarEstadoJuego(): Promise<void> {
    if (this.intentosRestantes === 0) {
      this.juegoTerminado = true;
      this.juegoPerdido = true;
      await this.guardarPuntaje();
      await this.mostrarTop();
    }

    if (this.palabraSecreta.join('') === this.palabra) {
      this.juegoTerminado = true;
      // this.mostrarTop();
      this.juegoGanado = true;
      this.puntos += 100 - (6 - this.intentosRestantes) * 10;

      this.cuentaRegresiva = 5;
      const intervalo = setInterval(() => {
        this.cuentaRegresiva--;
        if (this.cuentaRegresiva === 0) {
          clearInterval(intervalo);
          this.juegoTerminado = false;
          this.juegoGanado = false;
          this.inicializarJuego(false);
        }
      }, 1000);
    }
  }

  actualizarImagen(): void {
    const index = 6 - this.intentosRestantes;
    this.imagenAhorcado = `/ahorcado-imgs/blanco_${index}.png`;
  }

  obtenerPalabraAleatoria(): string {
    const index = Math.floor(Math.random() * palabras.length);
    return palabras[index];
  }

  async guardarPuntaje(): Promise<void> {
    if (!this.usuarioEmail) {
      console.log('No hay usuario logueado. No se guarda el puntaje.');
      return;
    }

    console.log(
      `Guardando puntaje en la tabla ${this.tablaPuntajes}, Usuario: ${this.usuarioEmail} Puntaje: ${this.puntos}`
    );

    try {
      await this.supabaseService.guardarPuntaje(this.tablaPuntajes, this.usuarioEmail, this.puntos);
    } catch (error) {
      console.error('Error al guardar el puntaje:', error);
    }
  }

  reiniciarJuego(): void {
    this.puntos = 0;
    this.mostrarRanking = false;
    this.inicializarJuego(true);

  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  async mostrarTop() {
  this.puntajes = await this.supabaseService.obtenerTopPuntajes('puntajes-ahorcado', 5);
  this.mostrarRanking = true;

  setTimeout(() => {
    const el = document.getElementById('ranking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

}
