import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevoparticipantePageRoutingModule } from './nuevoparticipante-routing.module';

import { NuevoparticipantePage } from './nuevoparticipante.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevoparticipantePageRoutingModule
  ],
  declarations: [NuevoparticipantePage]
})
export class NuevoparticipantePageModule {}
