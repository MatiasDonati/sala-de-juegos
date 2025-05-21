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

  constructor(private router: Router, private authService: AuthService) {}

  async ngOnInit() {
    this.userEmail = await this.authService.obtenerUsuarioActual();
  }

  jugarAhorcado() {
    this.router.navigate(['/juegos/ahorcado']);
  }

  jugarMayorMenor() {
    this.router.navigate(['/juegos/mayor-o-menor']);
  }

  jugarPreguntados() {
    this.router.navigate(['/juegos/preguntados']);
  }

  jugarMelodiaOlvidadiza() {
    this.router.navigate(['/juegos/melodia-olvidadiza']);
  }
}
