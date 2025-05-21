import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  supabase = supabase;

  async traerMensajes() {
    const { data, error } = await supabase
      .from('mensajes-del-chat')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error al traer mensajes:', error);
      return [];
    }

    return data;
  }

  async guardarMensaje(id_usuario: string, mensaje: string) {
    const { error } = await supabase
      .from('mensajes-del-chat')
      .insert([{ id_usuario, mensaje }]);

    if (error) {
      console.error('Error al guardar el mensaje:', error);
    }
  }
  async guardarPuntaje(tabla: string, email: string, puntaje: number): Promise<void> {
    try {
      const { data, error } = await supabase
        .from(tabla)
        .insert([{ email, puntaje }])
        .select();

      if (error) {
        console.error(`Error al guardar el puntaje en ${tabla}:`, error.message);
      } else {
        console.log(`Puntaje guardado en ${tabla}:`, data);
      }

    } catch (err) {
      console.error('Error en la inserción del puntaje:', err);
    }
  }

}
