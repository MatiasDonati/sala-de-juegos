import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';


interface Puntaje {
  email: string;
  puntos: number;
}

@Component({
  selector: 'app-puntajes',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './puntajes.component.html',
  styleUrl: './puntajes.component.css'
})
export class PuntajesComponent implements OnInit {

  juegos: { nombre: string; tabla: string; puntajes: Puntaje[] }[] = [
    { nombre: 'Melodía Olvidadiza', tabla: 'puntajes-melodia-olvidadiza', puntajes: [] },
    { nombre: 'Mayor o Menor', tabla: 'puntajes-mayor-menor', puntajes: [] },
    { nombre: 'Preguntados', tabla: 'puntajes-preguntados', puntajes: [] },
    { nombre: 'Ahorcado', tabla: 'puntajes-ahorcado', puntajes: [] },
  ];

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    for (let juego of this.juegos) {
      juego.puntajes = await this.supabaseService.obtenerTopPuntajes(juego.tabla, 5);
    }
  }
}
