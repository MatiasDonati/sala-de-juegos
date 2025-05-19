import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'melodia-olvidadiza',
    loadComponent: () => import('../melodia-olvidadiza/melodia-olvidadiza.component').then(c => c.MelodiaOlvidadizaComponent)
  },
  {
    path: 'ahorcado',
    loadComponent: () => import('../ahorcado/ahorcado.component').then(c => c.AhorcadoComponent)
  },
  {
    path: 'mayor-o-menor',
    loadComponent: () => import('../mayor-o-menor/mayor-o-menor.component').then(c => c.MayorOMenorComponent)
  },
  {
    path: 'preguntados',
    loadComponent: () => import('../preguntados/preguntados.component').then(c => c.PreguntadosComponent)
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class JuegosModule {}
