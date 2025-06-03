import { Component } from '@angular/core';

import { AuthService } from '../../../services/auth.service';
import { SupabaseService } from '../../../services/supabase.service';

import { HeaderComponent } from "../../header/header.component";
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';


interface Carta {
  valor: number;
  palo: string;
}

interface Puntaje {
  email: string;
  puntos: number;
}

@Component({
  selector: 'app-mayor-o-menor',
  templateUrl: './mayor-o-menor.component.html',
  styleUrls: ['./mayor-o-menor.component.css'],
  imports: [HeaderComponent, NgIf, NgFor]
})
export class MayorOMenorComponent {

  mazo: Carta[] = [];
  cartaActual: Carta | null = null;
  cartaSiguiente: Carta | null = null;

  puntos: number = 0;
  vidas: number = 5;

  juegoTerminado: boolean = false;
  jugadaAcertada: boolean | null = null;
  esIgual: boolean = false;

  usuarioEmail: string | null = null;

  palos: string[] = ['Oro', 'Basto', 'Espada', 'Copa'];

  tablaPuntajes: string = 'puntajes-mayor-menor';

  puntajes: Puntaje[] = [];
  mostrarRanking: boolean = false;

  constructor(
    private authService: AuthService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.iniciarJuego();
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

 
  iniciarJuego(): void {
    this.mazo = this.generarMazo();
    this.barajarMazo();
    this.siguienteCarta();
    this.puntos = 0;
    this.vidas = 5;
    this.juegoTerminado = false;
    this.jugadaAcertada = null;
    this.esIgual = false;
    this.mostrarRanking = false;
  }

  generarMazo(): Carta[] {
    const mazo: Carta[] = [];
    for (let valor = 1; valor <= 12; valor++) {
      this.palos.forEach(palo => {
        mazo.push({ valor, palo });
      });
    }
    return mazo;
  }

  barajarMazo(): void {
    this.mazo = this.mazo.sort(() => Math.random() - 0.5);
  }


  async siguienteCarta(): Promise<void> {
    if (this.mazo.length > 0) {
      this.cartaActual = this.cartaSiguiente || this.mazo.shift()!;
      this.cartaSiguiente = this.mazo.shift() || null;
      console.log('Carta actual:', this.cartaActual);
      console.log('Carta siguiente:', this.cartaSiguiente);
    } else {
      
        this.juegoTerminado = true;
        await this.guardarPuntaje();
        this.mostrarTop();    
      }
  }

  async verificarEleccion(eleccion: 'mayor' | 'menor'): Promise<void> {
    if (this.juegoTerminado || !this.cartaActual || !this.cartaSiguiente) return;

    const esMayor = this.cartaSiguiente.valor > this.cartaActual.valor;
    const esMenor = this.cartaSiguiente.valor < this.cartaActual.valor;
    const esIgual = this.cartaSiguiente.valor === this.cartaActual.valor;

    if (esIgual) {
      console.log('Era igual. No se pierde ni se gana.');
      this.esIgual = true;
      this.jugadaAcertada = null;
    } 
    else if ((eleccion === 'mayor' && esMayor) || (eleccion === 'menor' && esMenor)) {
      this.puntos++;
       this.esIgual = false;
      this.jugadaAcertada = true;
    } 
    else {
      this.vidas--;
       this.esIgual = false;
      this.jugadaAcertada = false;

      if (this.vidas <= 0) {
        this.juegoTerminado = true;
        await this.guardarPuntaje();
        this.mostrarTop();
      }
    }

    this.siguienteCarta();
  }


  async guardarPuntaje(): Promise<void> {
    if (!this.usuarioEmail) {
      console.log('No hay usuario logueado. No se guarda el puntaje.');
      return;
    }

    console.log(`Guardando puntaje en la tabla ${this.tablaPuntajes}, Usuario: ${this.usuarioEmail} Puntaje: ${this.puntos}`);

    try {
      await this.supabaseService.guardarPuntaje(this.tablaPuntajes, this.usuarioEmail, this.puntos);
    } catch (error) {
      console.error('Error al guardar el puntaje:', error);
    }
  }

  obtenerImagenPalo(palo: string): string {
    return `/cartas/${palo.toLowerCase()}.png`;
  }

  irALogin() {
     this.router.navigate(['/login']);
  }

  async mostrarTop() {
  this.puntajes = await this.supabaseService.obtenerTopPuntajes(this.tablaPuntajes, 5);
  this.mostrarRanking = true;

  setTimeout(() => {
    const el = document.getElementById('ranking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

}
