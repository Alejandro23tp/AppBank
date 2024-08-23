import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SemanalPageRoutingModule } from './semanal-routing.module';

import { SemanalPage } from './semanal.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SemanalPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [SemanalPage]
})
export class SemanalPageModule {}
