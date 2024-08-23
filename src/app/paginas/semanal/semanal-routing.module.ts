import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SemanalPage } from './semanal.page';

const routes: Routes = [
  {
    path: '',
    component: SemanalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SemanalPageRoutingModule {}
