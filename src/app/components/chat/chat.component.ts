import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '@supabase/supabase-js';
import { DatePipe, NgFor } from '@angular/common';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-chat',
  imports: [FormsModule, DatePipe, NgFor, HeaderComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  @ViewChild('chatBox') chatBox!: ElementRef;

  supabaseService = inject(SupabaseService);
  authService = inject(AuthService);
  mensajes = signal<any[]>([]);
  miUsuario: User | null = null;
  mensaje = '';

  constructor() {
    this.cargarMensajes();
    this.suscribirseAInsert();
    this.obtenerUsuario();
  }

  /**
   * Cargar todos los mensajes existentes
   */
  async cargarMensajes() {
    try {
      const data = await this.supabaseService.traerMensajes();
      this.mensajes.set(data);
      this.scrollToBottom();
    } catch (error) {
      console.error('Error al cargar los mensajes:', error);
    }
  }

  /**
   * Obtener el usuario actual
   */
  async obtenerUsuario() {
    try {
      const email = await this.authService.obtenerUsuarioActual();
      if (email) {
        this.miUsuario = { email } as User;
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  }

  /**
   * Enviar un mensaje a la tabla `mensajes-del-chat`
   */
  async enviar() {
    if (this.miUsuario?.email && this.mensaje.trim()) {
      try {
        await this.supabaseService.guardarMensaje(this.miUsuario.email, this.mensaje);
        this.mensaje = '';
        this.scrollToBottom();
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
      }
    }
  }

  /**
   * Suscribirse a los eventos INSERT en `mensajes-del-chat`
   */
  suscribirseAInsert() {
    const canal = this.supabaseService.supabase.channel('chat-realtime');

    canal.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'mensajes-del-chat',
      },
      (cambio) => {
        console.log('Nuevo mensaje recibido:', cambio.new);
        this.mensajes.set([...this.mensajes(), cambio.new]);
        this.scrollToBottom();
      }
    );

    canal.subscribe();
  }

  /**
   * Scroll automático al último mensaje
   */
  scrollToBottom() {
    setTimeout(() => {
      if (this.chatBox) {
        this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
      }
    }, 100);
  }

  /**
   * trackById - Optimización para el *ngFor
   */
  trackById(index: number, item: any): number {
    return item.id;
  }
}
