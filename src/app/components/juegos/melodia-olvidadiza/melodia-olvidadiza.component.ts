import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { NgClass, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { SupabaseService } from '../../../services/supabase.service';
import { FormsModule } from '@angular/forms';


interface Puntaje {
  email: string;
  puntos: number;
}


@Component({
  selector: 'app-melodia-olvidadiza',
  imports: [HeaderComponent, NgFor, NgClass, FormsModule, NgIf],
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

  async ngOnInit() {
    this.usuarioEmail = await this.authService.obtenerUsuarioActual();
  }

  constructor(private authService: AuthService, private supabaseService: SupabaseService,
) {}

  secuencia: string[] = [];
  notasTocadas: string[] = [];
  verificandoNotas: boolean = false;
  mensaje: string = '';
  juegoIniciado: boolean = false;

  puntos: number = 0;
  intentos: number = 3;
  usuarioEmail: string | null = null;
  tablaPuntajes: string = 'puntajes-melodia-olvidadiza';

  usarColores: boolean = true;
  ayudaVisual: boolean = false;

  notaActiva: string | null = null;

  botonApretadoSecuencia: boolean = false;
  
  tipoOnda: OscillatorType = 'sine';

  usarDelay: boolean = false;

  juegoTerminado: boolean = false;

  puntajes: Puntaje[] = [];
  mostrarRanking: boolean = false;

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

        if (this.botonApretadoSecuencia) {
          this.notaActiva = nota;
        }

        this.reproducirNota(nota);

        if (this.botonApretadoSecuencia) {
          setTimeout(() => {
            this.notaActiva = null;
          }, 300);
        }

        // AL FINAL DE LA SECUENCIA VIELVE EL TECLADO
        // AL FINAL DE LA SECUENCIA VIELVE EL TECLADO
        if (index === this.secuencia.length - 1) {
          setTimeout(() => {
            this.verificandoNotas = false;
          }, 300);
        }
        // PODRIA DISMINUiR O AUMENTAR EL TIEMPO DE ESPERA ENTRE NOTAS PARA DAR MAS PUNTAJE
        // PODRIA DISMINUiR O AUMENTAR EL TIEMPO DE ESPERA ENTRE NOTAS PARA DAR MAS PUNTAJE
      }, index * 500);
    });
  }


  reproducirNota(nota: string): void {
    const oscilador = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // console.log(nota)
    // console.log(this.frecuencias[nota])

    oscilador.frequency.value = this.frecuencias[nota];
    oscilador.type = this.tipoOnda;

    // SIN DELAY
    // SIN DELAY
    if (!this.usarDelay) {
      oscilador.connect(gainNode);
      gainNode.connect(audioContext.destination);
    } else {
      // CON DELAY
      // CON DELAY
      const delayNode = audioContext.createDelay();
      delayNode.delayTime.value = 0.5;

      oscilador.connect(gainNode);
      gainNode.connect(audioContext.destination);
      gainNode.connect(delayNode);
      delayNode.connect(audioContext.destination);
    }

    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

    oscilador.start();
    setTimeout(() => oscilador.stop(), 300);
  }

  
  async tocarNota(nota: string): Promise<void> {

    this.reproducirNota(nota);

    if (this.juegoTerminado) {
      return;
    }

    if (this.secuencia.length === 0 || this.verificandoNotas) {
      return;
    }
    
    const indexActual = this.notasTocadas.length;
    const notaEsperada = this.secuencia[indexActual];
    

    this.notasTocadas.push(nota);

    if (nota !== notaEsperada) {
      console.log('Nota incorrecta');

      this.intentos--;
      this.mensaje = this.intentos > 0 ? 'Nota incorrecta. Escucha con antencion' : 'PERDISTE';
      this.verificandoNotas = true;

      if (this.intentos === 0) {
        this.juegoTerminado = true;
        this.mostrarTop()
        await this.guardarPuntaje();
        if (this.usuarioEmail) {
          this.mensaje = '¡Puntaje guardado!';
        }
      }

      setTimeout(() => {
        this.notasTocadas = [];
        this.verificandoNotas = false;
        if (this.intentos > 0) {
          this.mensaje = '';
          this.reproducirSecuencia();
        }
      }, 1500);

      return;
    }

    console.log('Nota correcta');

    if (this.notasTocadas.length === this.secuencia.length) {
      this.verificandoNotas = true;
      this.mensaje = 'Perfecto';
      this.puntos += this.secuencia.length * 10;

      setTimeout(() => {
        this.secuencia.push(this.notas[Math.floor(Math.random() * this.notas.length)]);
        console.log('Nueva nota agregada:', this.secuencia);
        this.notasTocadas = [];
        this.verificandoNotas = false;
        this.mensaje = '';
        this.reproducirSecuencia();
      }, 1500);
    }
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
    this.secuencia = [];
    this.notasTocadas = [];
    this.mensaje = '';
    this.verificandoNotas = false;
    this.juegoIniciado = false;
    this.puntos = 0;
    this.intentos = 3;
    this.juegoTerminado = false;
    this.mostrarRanking = false;

  }

  async mostrarTop() {
    this.puntajes = await this.supabaseService.obtenerTopPuntajes('puntajes-melodia-olvidadiza', 5);
    this.mostrarRanking = true;

    setTimeout(() => {
      const elemento = document.getElementById('ranking');
      if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }



}
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
