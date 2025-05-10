import { NgIf } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router) {}

  jugarAhorcado() {
    console.log('Ahorcado');
  }

  jugarMayorMenor() {
    console.log('Mayor o Menor');
  }

  jugarPreguntados() {
    console.log('Preguntados');
  }

  jugarMiJuego() {
    console.log('Mi Juego');
  }
}
