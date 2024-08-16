import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagosemanalPageRoutingModule } from './pagosemanal-routing.module';

import { PagosemanalPage } from './pagosemanal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagosemanalPageRoutingModule
  ],
  declarations: [PagosemanalPage]
})
export class PagosemanalPageModule {}
