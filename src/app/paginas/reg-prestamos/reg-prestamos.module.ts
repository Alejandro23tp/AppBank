import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegPrestamosPageRoutingModule } from './reg-prestamos-routing.module';

import { RegPrestamosPage } from './reg-prestamos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegPrestamosPageRoutingModule
  ],
  declarations: [RegPrestamosPage]
})
export class RegPrestamosPageModule {}
