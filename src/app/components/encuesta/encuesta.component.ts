import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { edadValidaValidator } from '../../validators/edad.validator';
import { telefonoValidoValidator } from '../../validators/telefono.validator';
import { usuarioExisteValidator } from '../../validators/usuario-existe.validator';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent]
})
export class EncuestaComponent implements OnInit {
  
constructor(private usuariosService: AuthService) {}

  form!: FormGroup;

  formFueEnviado = false;


  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('',{
        validators: [Validators.required, Validators.email],
        asyncValidators: [usuarioExisteValidator(this.usuariosService)],
        updateOn: 'blur'
      }),
      nombre: new FormControl('', Validators.required),
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

  enviarForm(): void {
    this.formFueEnviado = true;

    if (this.form.valid) {
      console.log('Encuesta enviada:', this.form.value);
      this.form.reset();
      this.formFueEnviado = false;
    } else {
      this.form.markAllAsTouched();
    }
  }



}
