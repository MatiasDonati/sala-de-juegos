import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { NgFor, NgIf } from '@angular/common';
import { palabras } from './array-de-palabras';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css'],
  imports: [HeaderComponent, NgFor, NgIf]
})

export class AhorcadoComponent {
  // palabra: string = 'SALAME';
  palabra = this.obtenerPalabraAleatoria();
  palabraSecreta: string[] = [];
  letrasFallidas: string[] = [];
  intentosRestantes: number = 6;
  abecedario: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  imagenAhorcado: string = '';
  juegoTerminado: boolean = false;
  juegoGanado: boolean = false;
  juegoPerdido: boolean = false;

  constructor() {
    this.inicializarJuego();
  }

  inicializarJuego(): void {
    this.palabra = this.obtenerPalabraAleatoria();
    console.log(this.palabra);
    this.palabraSecreta = Array(this.palabra.length).fill('_');
    this.letrasFallidas = [];
    this.intentosRestantes = 6;
    this.juegoTerminado = false;
    this.juegoGanado = false;
    this.juegoPerdido = false;
    this.actualizarImagen();
  }
  

  verificarLetra(letra: string): void {
    if (this.juegoTerminado) return;

    if (this.intentosRestantes > 0 && !this.palabraSecreta.includes(letra) && !this.letrasFallidas.includes(letra)) {
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

  verificarEstadoJuego(): void {
    if (this.intentosRestantes === 0) {
      this.juegoTerminado = true;
      this.juegoPerdido = true;
    }

    if (this.palabraSecreta.join('') === this.palabra) {
      this.juegoTerminado = true;
      this.juegoGanado = true;
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

  reiniciarJuego(): void {
    this.inicializarJuego();
  }
}
