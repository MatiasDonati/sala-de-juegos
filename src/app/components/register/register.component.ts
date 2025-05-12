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

  async register() {

    try {
      const { data: usaurioEmailExistente } = await supabase
        .from('users-data')
        .select('mail')
        .eq('mail', this.email)
        .single();

      if (usaurioEmailExistente) {
        this.mensaje = 'El email ya se encuentra en uso.';
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: this.email,
        password: this.password
      });

      if (error) {
        this.mensaje = 'Error al registrarse: ' + error.message;
        return;
      }

      await supabase.from('users-data').insert([{ authId: data.user?.id, mail: data.user?.email }]);
      this.mensaje = '¡Registro exitoso! Revisá tu correo.';
      this.router.navigate(['/login']);
      
    } catch (err) {
      this.mensaje = 'Ocurrió un error inesperado.';
      console.error(err);
    }
  }
}
