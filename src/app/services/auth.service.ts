import { Injectable } from '@angular/core';
import { createClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  async obtenerUsuarioActual(): Promise<string | null> {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error al obtener el usuario actual:', error.message);
        return null;
      }

      if (data.user.email) {
        console.log('Usuario logueado:', data.user.email);
        return data.user.email;
      }

      return null;

    } catch (err) {
      console.error('Error al verificar el usuario actual:', err);
      return null;
    }
  }
}
