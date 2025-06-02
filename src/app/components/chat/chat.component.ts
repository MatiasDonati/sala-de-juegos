import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '@supabase/supabase-js';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-chat',
  imports: [FormsModule, NgFor, HeaderComponent, NgIf],
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
  usuarioEmail : string | null = null;

  tabla = 'mensajes-del-chat';
  // tabla2 = 'mensajes-del-chat-v2';
  

  constructor() {

    this.suscribirseAInsert();
    this.obtenerUsuario();
  }

    ngOnInit(): void {
    this.cargarMensajesPasados();
  }

  async cargarMensajesPasados() {
    try {
      const data = await this.supabaseService.traerMensajes();
      this.mensajes.set(data);
      this.scrollToBottom();
    } catch (error) {
      // console.error('Error al cargar los mensajes:', error);
    }
  }

  async obtenerUsuario() {
    try {
      const email = await this.authService.obtenerUsuarioActual();
      if (email) {
        this.miUsuario = { email } as User;
        this.usuarioEmail = email;
      }
    } catch (error) {
      // console.error('Error al obtener el usuario:', error);
    }
  }

  async enviar() {
    if (this.miUsuario?.email && this.mensaje.trim()) {
      try {
        await this.supabaseService.guardarMensaje(this.miUsuario.email, this.mensaje);
        this.mensaje = '';
        this.scrollToBottom();
      } catch (error) {
        // console.error('Error al enviar el mensaje:', error);
      }
    }
  }

  suscribirseAInsert() {
    const canal = this.supabaseService.supabase.channel('chat-realtime');

    canal.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: this.tabla,
      },
      (cambio) => {
        // console.log('Nuevo mensaje recibido:', cambio.new?.['mensaje']);
        // console.log('Objeto Mensaje:', cambio.new);
        this.mensajes.set([...this.mensajes(), cambio.new]);
        this.scrollToBottom();
      }
    );

    canal.subscribe();
  }


  scrollToBottom() {
    setTimeout(() => {
      if (this.chatBox) {
        this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
      }
    }, 100);
  }


  trackById(index: number, item: any): number {
    return item.id;
  }

  private datePipe = new DatePipe('es-AR');

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    date.setHours(date.getHours() - 3);
    return this.datePipe.transform(date, 'd/M/yy - h:mm a') ?? '';
  }



}
