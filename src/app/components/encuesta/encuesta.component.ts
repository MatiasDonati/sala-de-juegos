import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { edadValidaValidator } from '../../validators/edad.validator';
import { telefonoValidoValidator } from '../../validators/telefono.validator';
import { usuarioExisteValidator } from '../../validators/usuario-existe.validator';
import { AuthService } from '../../services/auth.service';
import { nombreApellidoValidator } from '../../validators/nombre-apellido.validator';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent]
})
export class EncuestaComponent implements OnInit {
  
constructor(private supabaseService: SupabaseService, private usuariosService: AuthService, private router: Router) {}

  form!: FormGroup;

  formFueEnviado = false;
  usuarioAutenticadoEmail: string | null = null;
  mensaje: string = '';

  ngOnInit(): void {
    this.usuariosService.obtenerUsuarioActual().then(email => {
      this.usuarioAutenticadoEmail = email;

      this.form.get('email')?.setValue(email);
      this.form.get('email')?.updateValueAndValidity();
    });

  this.form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [usuarioExisteValidator(this.usuariosService)],
      updateOn: 'blur'
    }),
      nombre: new FormControl('', [
        Validators.required,
        nombreApellidoValidator()
      ]),
      apellido: new FormControl('', [
        Validators.required,
        nombreApellidoValidator()
      ]),
      edad: new FormControl('', [
        Validators.required,
        edadValidaValidator(18, 99)
      ]),
      telefono: new FormControl('', [
        Validators.required,
        telefonoValidoValidator()
      ]),
      juegoFavorito: new FormControl('', Validators.required),
      juegosFaltantes: new FormControl('', Validators.required),
      aceptaNovedades: new FormControl(false, Validators.requiredTrue)
    });
  }
  

  async enviarForm() {
    this.formFueEnviado = true;

    if (this.form.valid && this.usuarioAutenticadoEmail) {
      
      const yaRespondio = await this.supabaseService.encuestaYaRealizada(this.usuarioAutenticadoEmail);
      
      if (yaRespondio) {
        this.mensaje = 'En otra oportunidad ya completaste la encuesta. ¡Gracias!';
        setTimeout(() => {
          this.router.navigate(['/home']);
          this.form.reset();
          this.formFueEnviado = false;
          this.mensaje = '';
        }, 4000);
        return;
      }


      const encuesta = {
        email: this.usuarioAutenticadoEmail,
        nombre: this.form.get('nombre')?.value,
        apellido: this.form.get('apellido')?.value,
        edad: this.form.get('edad')?.value,
        telefono: this.form.get('telefono')?.value,
        juego_favorito: this.form.get('juegoFavorito')?.value,
        juegos_faltantes: this.form.get('juegosFaltantes')?.value,
        acepta_novedades: this.form.get('aceptaNovedades')?.value,
      };

     const ok = await this.supabaseService.guardarEncuesta(encuesta);

    if (ok) {
      this.mensaje = '¡Encuesta enviada con éxito! Muchas Gracias!';
      console.log('Encuesta enviada con éxito!');
      this.form.reset();
      this.formFueEnviado = false;
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 4000);
    }
  }
}



}
