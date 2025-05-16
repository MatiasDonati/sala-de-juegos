import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  /**
   * Simulación de autenticación - Retorna un email fijo
   */
  async obtenerUsuarioActual(): Promise<string | null> {
    return 'matias@example.com';
  }
}
