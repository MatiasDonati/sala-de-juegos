import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Personaje {
  nombre: string;
  imagenUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonajesService {
  private readonly apiUrl = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}

  obtenerPersonajes(): Observable<Personaje[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response =>
        response.results.map((p: any) => ({
          nombre: p.name,
          imagenUrl: p.image
        }))
      )
    );
  }
}
