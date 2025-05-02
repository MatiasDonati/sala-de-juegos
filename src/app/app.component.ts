import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

console.log(environment.supabaseUrl);
console.log(environment.supabaseKey);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sala-de-juegos';

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