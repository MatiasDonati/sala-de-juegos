import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

const SUPABASE_URL = 'https://tu-supabase-url.supabase.co';
const SUPABASE_KEY = 'tu-supabase-key';
const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  supabase = supabase;

  /**
   * Traer todos los mensajes de la tabla `mensajes-del-chat`
   */
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

  /**
   * Guardar un mensaje en la tabla `mensajes-del-chat`
   */
  async guardarMensaje(id_usuario: string, mensaje: string) {
    const { error } = await supabase
      .from('mensajes-del-chat')
      .insert([{ id_usuario, mensaje }]);

    if (error) {
      console.error('Error al guardar el mensaje:', error);
    }
  }
}
