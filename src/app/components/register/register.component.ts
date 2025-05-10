import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule, HeaderComponent]
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  mensaje: string = '';

  constructor(private router: Router) {}

  register() {
    console.log('Intentando registrar usuario en auth.users...');

    supabase.auth.signUp({
      email: this.email,
      password: this.password
    })
    .then(({ data, error }) => {
      if (error) {
        console.error('Error al registrarse en auth.users:', error.message);
        this.mensaje = 'Error al registrarse: ' + error.message;
        return;
      }

      if (data.user) {
        const authId = data.user.id;
        const email = data.user.email;

        console.log('Datos a insertar en users-data:', { authId, mail: email });

        // Insertar en users-data
        supabase
          .from('users-data')
          .insert([{ authId: authId, mail: email }])
          .then(({ data, error }) => {
            if (error) {
              console.error('Error al insertar en users-data:', error.message);
              this.mensaje = 'Error al registrar en la base de datos.';
              return;
            }

            console.log('Usuario guardado en users-data:', data);
            this.mensaje = '¡Registro exitoso! Revisá tu correo.';
            this.router.navigate(['/login']);
          });
      }
    });
  }
}
