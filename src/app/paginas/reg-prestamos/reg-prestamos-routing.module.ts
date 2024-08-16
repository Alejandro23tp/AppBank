import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegPrestamosPage } from './reg-prestamos.page';

const routes: Routes = [
  {
    path: '',
    component: RegPrestamosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegPrestamosPageRoutingModule {}
