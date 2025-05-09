import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Component({
  selector: 'app-home',
  standalone: true,
  // imports: [NgFor],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {


  constructor(private router: Router) {}

  jugarAhorcado() {
    console.log('Ir al juego Ahorcado');
  }

  jugarMayorMenor() {
    console.log('Ir al juego Mayor o Menor');
  }

  jugarPreguntados() {
    console.log('Ir al juego Preguntados');
  }

  jugarMiJuego() {
    console.log('Ir a Mi Juego');
  }

  // usersdata: any[] = [];

  // ngOnInit(): void {
  //   this.getUserData();
  // }

  // getUserData() {
  //   supabase.from('users-data').select('*').then(({ data, error }) => {
  //     if (error) {
  //       console.error('Error:', error.message);
  //     } else {
  //       console.log('Datos de usuarios:', data);
  //       this.usersdata = data;
  //     }
  //   });
  // }
  

  // getAvatarUrl(avatarUrl: string) {
  //   return supabase.storage.from('images').getPublicUrl(avatarUrl).data.publicUrl;
  // }

}
