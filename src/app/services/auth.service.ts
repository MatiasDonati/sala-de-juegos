import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private userEmail: string | null = null;

  async obtenerUsuarioActual(): Promise<string | null> {
    if (this.userEmail !== null) {
      return this.userEmail;
    }

    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        // console.error('Error al obtener el usuario actual:', error.message);
        this.userEmail = null;
        return null;
      }

      this.userEmail = data.user?.email || null;
      return this.userEmail;

    } catch (err) {
      console.error('Error al verificar el usuario actual:', err);
      this.userEmail = null;
      return null;
    }
  }

  async cerrarSesion(): Promise<void> {
    try {
      await supabase.auth.signOut();
      this.userEmail = null;
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  }
}
