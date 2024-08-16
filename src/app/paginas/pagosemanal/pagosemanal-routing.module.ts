import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagosemanalPage } from './pagosemanal.page';

const routes: Routes = [
  {
    path: '',
    component: PagosemanalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagosemanalPageRoutingModule {}
