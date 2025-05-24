import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userEmail: string | null = null;

  juegos = [
    {
      nombre: 'Ahorcado',
      ruta: '/juegos/ahorcado',
      imagen: 'juegos-imgs/ahorcado.png'
    },
    {
      nombre: 'Mayor o Menor',
      ruta: '/juegos/mayor-o-menor',
      imagen: 'juegos-imgs/mayor-menor.png'
    },
    {
      nombre: 'Preguntados',
      ruta: '/juegos/preguntados',
      imagen: 'juegos-imgs/preguntados.png'
    },
    {
      nombre: 'Melodia Olvidadiza',
      ruta: '/juegos/melodia-olvidadiza',
      imagen: 'juegos-imgs/melodia-olvidadiza.png'
    }
  ];

  constructor(private router: Router, private authService: AuthService) {}

  async ngOnInit() {
    this.userEmail = await this.authService.obtenerUsuarioActual();
  }

  jugar(ruta: string) {
    this.router.navigate([ruta]);
  }
}
