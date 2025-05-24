import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-melodia-olvidadiza',
  imports: [HeaderComponent, NgFor, NgIf],
  templateUrl: './melodia-olvidadiza.component.html',
  styleUrl: './melodia-olvidadiza.component.css'
})

export class MelodiaOlvidadizaComponent {
  notas = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C2'];
  frecuencias: { [key: string]: number } = {
    C: 261.63,
    D: 293.66,
    E: 329.63,
    F: 349.23,
    G: 392.00,
    A: 440.00,
    B: 493.88,
    C2: 523.25,
  };

  secuencia: string[] = [];
  notasTocadas: string[] = [];
  verificandoNotas: boolean = false;
  mensaje: string = '';
  juegoIniciado: boolean = false;

  puntos: number = 0;
  intentos: number = 3;


  generarSecuencia(length: number): void {
    this.juegoIniciado = true;
    this.secuencia = Array.from({ length }, () => this.notas[Math.floor(Math.random() * this.notas.length)]);
    console.log('Secuencia generada:', this.secuencia);
    this.notasTocadas = [];
    this.reproducirSecuencia();
  }

  reproducirSecuencia(): void {
    this.verificandoNotas = true;

    this.secuencia.forEach((nota, index) => {
      setTimeout(() => {
        this.reproducirNota(nota);

        // Al final de la secuencia, se habilita el teclado
        if (index === this.secuencia.length - 1) {
          setTimeout(() => {
            this.verificandoNotas = false;
          }, 300);
        }
      }, index * 500);
    });
  }



  reproducirNota(nota: string): void {
    // console.log(`(Auto) Tocando: ${nota}`);
    const oscilador = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscilador.frequency.value = this.frecuencias[nota];
    oscilador.type = 'sine';

    oscilador.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

    oscilador.start();
    setTimeout(() => oscilador.stop(), 300);
  }
  
  tocarNota(nota: string): void {

    this.reproducirNota(nota);

    if (this.secuencia.length === 0) {
      return;
    }

    if (this.notasTocadas.length >= this.secuencia.length) {
      return;
    }

    this.notasTocadas.push(nota);
    console.log(this.notasTocadas);

    if (this.notasTocadas.length === this.secuencia.length) {
      this.verificandoNotas = true;
      console.log('mismas cantidad q secuencia')
      this.chekearSecuencia();
    }
  }


  chekearSecuencia(): void {
    if (this.notasTocadas.length === this.secuencia.length) {
      const esCorrecta = this.notasTocadas.every(
        (nota, index) => nota === this.secuencia[index]
      );

      this.notasTocadas = [];

      if (esCorrecta) {
        console.log('Secuencia Correcta!');
        this.mensaje = '¡Bien hecho!';
        setTimeout(() => {
          this.secuencia.push(this.notas[Math.floor(Math.random() * this.notas.length)]);
          console.log('Nueva nota agregada, secuencia:', this.secuencia);
          this.verificandoNotas = false;
          this.mensaje = '';
          this.reproducirSecuencia();
        }, 2000);
      } else {
        console.log('Secuencia INCORRECTA!');
        this.intentos -= 1;
        this.mensaje = this.intentos > 0 ? 'Intentalo de nuevo' : 'PERDISTE ¡Juego terminado!';
        this.notasTocadas = [];
        this.verificandoNotas = true;
        
        setTimeout(() => {
          if (this.intentos > 0) {
            this.reproducirSecuencia();
          }
        }, 2000);

      }
    }
  }

reiniciarJuego(): void {
  this.secuencia = [];
  this.notasTocadas = [];
  this.mensaje = '';
  this.verificandoNotas = false;
  this.juegoIniciado = false;
  this.puntos = 0;
  this.intentos = 3;
}




}
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
