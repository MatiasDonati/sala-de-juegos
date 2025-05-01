import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule,CommonModule]
})

export class RegisterComponent {
  email: string = '';
  password: string = '';
  name: string = '';
  age: number = 0;
  avatarFile: File | null = null;
  mensaje: string = '';

  constructor(private router: Router) {}

  register() {
    supabase.auth.signUp({
      email: this.email,
      password: this.password
    }).then(({ data, error }) => {
      if (error) {
        this.mensaje = 'Error al registrarse: ' + error.message;
      } else {
        this.mensaje = '¡Registro exitoso! Revisá tu correo.';
        if (data.user) {
          this.saveUserData(data.user);
        }
        this.router.navigate(['/login']);
      }
    });
  }

  async saveUserData(user: User) {
    const uploaded = await this.saveFile();
    const avatarUrl = uploaded?.path || '';

    supabase.from('users-data').insert([{
      authId: user.id,
      name: this.name,
      age: this.age,
      avatarUrl: avatarUrl,
      mail: this.email
    }]).then(({ error }) => {
      if (error) {
        console.error('Error al guardar en users-data:', error.message);
      } else {
        console.log('Datos guardados correctamente');
      }
    });
  }

  async saveFile() {
    if (!this.avatarFile) return null;
    const { data, error } = await supabase
      .storage
      .from('images')
      .upload(`users/${this.avatarFile.name}`, this.avatarFile, {
        cacheControl: '3600',
        upsert: false
      });
    if (error) {
      console.error('Error al subir imagen:', error.message);
    }
    return data;
  }

  onFileSelected(event: any) {
    this.avatarFile = event.target.files[0];
  }
}
