import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { NgClass, NgFor } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { SupabaseService } from '../../../services/supabase.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-melodia-olvidadiza',
  imports: [HeaderComponent, NgFor, NgClass, FormsModule],
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
    console.log(this.usuarioEmail)
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
  usarColores: boolean = false;
  ayudaVisual: boolean = false;

  notaActiva: string | null = null;

  botonApretadoSecuencia: boolean = false;

  
  tipoOnda: OscillatorType = 'sine';

  usarDelay: boolean = false;


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

        // Si el botón de ayuda visual está activado, se muestra la nota como activa
        if (this.botonApretadoSecuencia) {
          this.notaActiva = nota;
        }

        this.reproducirNota(nota);

        // Si se activa visualmente, se desactiva después de 300ms
        if (this.botonApretadoSecuencia) {
          setTimeout(() => {
            this.notaActiva = null;
          }, 300);
        }

        // Al final de la secuencia se habilita el teclado
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

    oscilador.frequency.value = this.frecuencias[nota];
    oscilador.type = this.tipoOnda;

    // Sin efectos
    if (!this.usarDelay) {
      oscilador.connect(gainNode);
      gainNode.connect(audioContext.destination);
    } else {
      // Con delay
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


  async chekearSecuencia(): Promise<void> {
    if (this.notasTocadas.length === this.secuencia.length) {
      const esCorrecta = this.notasTocadas.every(
        (nota, index) => nota === this.secuencia[index]
      );

      this.notasTocadas = [];

      if (esCorrecta) {
        console.log('Secuencia Correcta!');
        this.mensaje = '¡Bien hecho!';
        this.puntos += this.secuencia.length * 10;
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
        this.verificandoNotas = true;

        if (this.intentos === 0) {
          await this.guardarPuntaje();
          if(this.usuarioEmail){
            this.mensaje = '¡Puntaje guardado!';
          }
        }

        setTimeout(() => {
          if (this.intentos > 0) {
            this.reproducirSecuencia();
          }
        }, 2000);
      }
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
  }
  


}
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
