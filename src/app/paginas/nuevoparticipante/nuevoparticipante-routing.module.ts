import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevoparticipantePage } from './nuevoparticipante.page';

const routes: Routes = [
  {
    path: '',
    component: NuevoparticipantePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevoparticipantePageRoutingModule {}
