import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Input } from '@angular/core';

@Component({
  selector: 'app-participantes-modal',
  templateUrl: './participantes-modal.component.html',
  styleUrls: ['./participantes-modal.component.scss'],
})
export class ParticipantesModalComponent{
  @Input() data: any; // Entrada de datos para el modal

  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss(); // Cierra el modal
  }
}
