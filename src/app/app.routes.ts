import { Routes } from '@angular/router';
import { canMatchGuardObtenerUsuario } from './guards/can-match.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent) 
  },
  { 
    path: 'home', 
    loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent) 
  },
  { 
    path: 'quien-soy', 

    loadComponent: () => import('./components/quien-soy/quien-soy.component').then(c => c.QuienSoyComponent) 
  },
  { 
    path: 'chat', 
    canMatch: [canMatchGuardObtenerUsuario],
    loadComponent: () => import('./components/chat/chat.component').then(c => c.ChatComponent) 
  },
  { 
    path: 'juegos',
    canMatch: [canMatchGuardObtenerUsuario],
    loadChildren: () => import('./components/juegos/juegos-modulo/juegos.module').then(m => m.JuegosModule)
  },
  { 
    path: 'encuesta',
    canMatch: [canMatchGuardObtenerUsuario],
    loadComponent: () => import('./components/encuesta/encuesta.component').then(m => m.EncuestaComponent)
  },
  { 
    path: 'puntajes',
    loadComponent: () => import('./components/puntajes/puntajes.component').then(m => m.PuntajesComponent)
  },
];
