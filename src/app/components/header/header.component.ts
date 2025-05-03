import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  
  title = 'Sala de Juegos';

  constructor(private router: Router) {}

  irAHome() {
    this.router.navigate(['/home']);
  }
  irAQuienSoy() {
    this.router.navigate(['/quien-soy']);
  }
  irALogin() {
    this.router.navigate(['/login']);
  }
  irARegister() {
    this.router.navigate(['/register']);
}
}
