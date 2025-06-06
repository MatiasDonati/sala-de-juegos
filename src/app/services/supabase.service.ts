import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

interface Puntaje {
  email: string;
  puntos: number;
}


@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  supabase = supabase;
  tabla = 'mensajes-del-chat';

  async traerMensajes() {
    const { data, error } = await supabase
      .from(this.tabla)
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
      .from(this.tabla)
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

  async guardarEncuesta(datos: {
    email: string;
    nombre: string;
    apellido: string;
    edad: number;
    telefono: string;
    juego_favorito: string;
    juegos_faltantes: string;
    acepta_novedades: boolean;
    sugerencias?: string;
  }): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('encuestas')
        .insert([datos]);

      if (error) {
        console.error('Error al guardar la encuesta:', error.message);
        return false;
      }

      console.log('Encuesta guardada con éxito');
      return true;
    } catch (err) {
      console.error('Excepción al guardar la encuesta:', err);
      return false;
    }
  }


  async encuestaYaRealizada(email: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('encuestas')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error al verificar si ya respondió:', error.message);
        return false;
      }

      return !!data;
    } catch (err) {
      console.error('Error al consultar encuesta previa:', err);
      return false;
    }
  }

  async obtenerTopPuntajes(nombreTabla: string, limite: number = 5): Promise<Puntaje[]> {
    const { data, error } = await this.supabase
      .from(nombreTabla)
      .select('email, puntaje')
      .order('puntaje', { ascending: false });

    if (error || !data) {
      console.error(`Error al obtener puntajes de ${nombreTabla}:`, error?.message);
      return [];
    }

    const filtrados = data
      .filter((item: any) => item.puntaje > 0)
      .slice(0, limite)
      .map((item: any) => ({
        email: item.email.split('@')[0],
        puntos: item.puntaje
      }));

    return filtrados;
  }

}
