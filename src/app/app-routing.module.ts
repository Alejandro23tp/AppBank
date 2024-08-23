import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./paginas/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'principal',
    loadChildren: () => import('./paginas/principal/principal.module').then( m => m.PrincipalPageModule)
  },
  {
    path: 'participantes',
    loadChildren: () => import('./paginas/participantes/participantes.module').then( m => m.ParticipantesPageModule)
  },
  {
    path: 'nuevoparticipante',
    loadChildren: () => import('./paginas/nuevoparticipante/nuevoparticipante.module').then( m => m.NuevoparticipantePageModule)
  },
  {
    path: 'pagosemanal',
    loadChildren: () => import('./paginas/pagosemanal/pagosemanal.module').then( m => m.PagosemanalPageModule)
  },
  {
    path: 'prestamos',
    loadChildren: () => import('./paginas/prestamos/prestamos.module').then( m => m.PrestamosPageModule)
  },
  {
    path: 'reg-prestamos',
    loadChildren: () => import('./paginas/reg-prestamos/reg-prestamos.module').then( m => m.RegPrestamosPageModule)
  },
  {
    path: 'semanal',
    loadChildren: () => import('./paginas/semanal/semanal.module').then( m => m.SemanalPageModule)
  },
  {
    path: 'recordatorios',
    loadChildren: () => import('./paginas/recordatorios/recordatorios.module').then( m => m.RecordatoriosPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
