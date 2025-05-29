import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { NgFor, NgIf } from '@angular/common';
import { PersonajesService, Personaje } from '../../../services/personajes.service';
import { AuthService } from '../../../services/auth.service';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-preguntados',
  imports: [HeaderComponent, NgFor, NgIf],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css'
})

export class PreguntadosComponent {

  constructor(
    private personajesService: PersonajesService,
    private authService: AuthService,
    private supabaseService: SupabaseService,
    
  ) {
    this.obtenerUsuario();
  }

  mensaje: string = '';
  darMensaje: boolean = false;

  usuarioEmail: string | null = null;
  puntos: number = 0;
  vidas: number = 3;

  respuestasDeshabilitadas: boolean = false;

  tablaPuntajes: string = 'puntajes-preguntados';

  PERSONAJES: Personaje[] = [];

  personajesIniciales: Personaje[] = [];


  preguntaActual: {
    imagen: string;
    opciones: string[];
    correcta: string;
  } | null = null;


  ngOnInit() {
    this.personajesService.obtenerPersonajes().subscribe((personajes) => {
      this.personajesIniciales = personajes;
      this.PERSONAJES = [...this.personajesIniciales];
      this.cargarNuevaPregunta();
    });
  }


  
  cargarNuevaPregunta() {

      console.log(this.PERSONAJES.length)

    if (this.PERSONAJES.length < 1) {

      this.mensaje = '¡No hay más preguntas!';
      this.darMensaje = true;
      this.respuestasDeshabilitadas = true;
      return;
    }

    const indiceCorrecto = Math.floor(Math.random() * this.PERSONAJES.length);
    const correcto = this.PERSONAJES.splice(indiceCorrecto, 1)[0];

    const personajesRestantes = [...this.PERSONAJES];
    const incorrectas = personajesRestantes.sort(() => 0.5 - Math.random()).slice(0, 3);

    const opciones = [...incorrectas.map(p => p.nombre), correcto.nombre]
      .sort(() => 0.5 - Math.random());

    this.preguntaActual = {
      imagen: correcto.imagenUrl,
      opciones,
      correcta: correcto.nombre,
    };

    console.log(`Respuesta: ${this.preguntaActual?.correcta}`);
  }


  verificarRespuesta(opcion: string) {
    if (this.respuestasDeshabilitadas || this.vidas <= 0) return;

    this.respuestasDeshabilitadas = true;

    const esCorrecta = opcion === this.preguntaActual?.correcta;

    if (esCorrecta) {
      this.puntos += 10;
      this.mensaje = '¡Correcto! Siguiente personaje...';
    } else {
      this.vidas -= 1;

      if (this.vidas <= 0) {
        this.mensaje = '¡Juego terminado! Has perdido todas tus vidas.';
        this.guardarPuntaje();
        return;
      }

      this.mensaje = `Incorrecto. Era: ${this.preguntaActual?.correcta}`;
    }

    this.darMensaje = true;

    setTimeout(() => {


      //TESTEO GANAR RAPIDO!
      //TESTEO GANAR RAPIDO!

      const noHayMasPersonajes = 0;
      const ganarRapido = 17;

      if (this.PERSONAJES.length === noHayMasPersonajes && this.vidas > 0) {

        this.mensaje = '¡Felicitaciones! Ganaste.';

        this.guardarPuntaje();
        this.darMensaje = true;
        this.respuestasDeshabilitadas = true;
      } else {
        this.cargarNuevaPregunta();
        this.respuestasDeshabilitadas = false;
        this.darMensaje = false;
      }
    }, 2500);
  }

    async obtenerUsuario(): Promise<void> {
    try {
      this.usuarioEmail = await this.authService.obtenerUsuarioActual();
      console.log('Usuario logueado:', this.usuarioEmail);
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
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
    this.PERSONAJES = [...this.personajesIniciales];
    this.puntos = 0;
    this.vidas = 3;
    this.mensaje = '';
    this.respuestasDeshabilitadas = false;
    this.cargarNuevaPregunta();
  }

}
