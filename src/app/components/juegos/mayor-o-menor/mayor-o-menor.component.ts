import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { NgIf } from '@angular/common';

interface Carta {
  valor: number;
  palo: string;
}

@Component({
  selector: 'app-mayor-o-menor',
  templateUrl: './mayor-o-menor.component.html',
  styleUrls: ['./mayor-o-menor.component.css'],
  imports: [HeaderComponent, NgIf]
})
export class MayorOMenorComponent {

  mazo: Carta[] = [];
  cartaActual: Carta | null = null;
  cartaSiguiente: Carta | null = null;
  puntos: number = 0;
  vidas: number = 5;
  juegoTerminado: boolean = false;
  jugadaAcertada: boolean | null = null;

  palos: string[] = ['Oro', 'Basto', 'Espada', 'Copa'];

  constructor() {
    this.iniciarJuego();
  }

  iniciarJuego(): void {
    this.mazo = this.generarMazo();
    this.barajarMazo();
    this.siguienteCarta();
    this.puntos = 0;
    this.vidas = 5;
    this.juegoTerminado = false;
    this.jugadaAcertada = null;

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

  siguienteCarta(): void {
    if (this.mazo.length > 0) {
      this.cartaActual = this.cartaSiguiente || this.mazo.shift()!;
      this.cartaSiguiente = this.mazo.shift() || null;
    } else {
      this.juegoTerminado = true;
    }
  }

  verificarEleccion(eleccion: 'mayor' | 'menor'): void {
    if (this.juegoTerminado || !this.cartaActual || !this.cartaSiguiente) return;

    const esMayor = this.cartaSiguiente.valor > this.cartaActual.valor;
    const esMenor = this.cartaSiguiente.valor < this.cartaActual.valor;

    if ((eleccion === 'mayor' && esMayor) || (eleccion === 'menor' && esMenor)) {
      this.puntos++;
      this.jugadaAcertada = true;
    } else {
      this.vidas--;
      this.jugadaAcertada = false;
      if (this.vidas <= 0) {
        this.juegoTerminado = true;
      }
    }

    this.siguienteCarta();
  }

  obtenerImagenPalo(palo: string): string {
    return `/cartas/${palo.toLowerCase()}.png`;
  }
}
