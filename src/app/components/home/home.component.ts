import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  userEmail: string | null = null;

  constructor(private router: Router) {}

  recibirUsuarioLogueado(email: string | null) {
    this.userEmail = email;
  }

  jugarAhorcado() {
    console.log('Ahorcado');
  }

  jugarMayorMenor() {
    console.log('Mayor o Menor');
  }

  jugarPreguntados() {
    console.log('Preguntados');
  }

  jugarMelodiaOlvidadiza() {
    // console.log('Melodia Olvidadiza');
    this.router.navigate(['/juegos/melodia-olvidadiza']);
  }
}