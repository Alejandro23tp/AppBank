import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PagosService } from '../servicios/pagos.service';

@Component({
  selector: 'app-participantespagos-modal',
  templateUrl: './participantespagos-modal.component.html',
  styleUrls: ['./participantespagos-modal.component.scss'],
})
export class ParticipantespagosModalComponent implements OnInit{
  @Input() data: any;
  DatosFiltrados: any[] = [];  // Cambié la declaración para que sea un array

  constructor(
    private modalController: ModalController,
    private servPagos: PagosService
  ) {}

  ngOnInit() {
    if (this.data && this.data.id) {
      this.servPagos.listarPagosxId(this.data.id).subscribe(
        response => {
          if (response && response.data) {
            // Filtra los datos por la semana y asigna a DatosFiltrados
            this.DatosFiltrados = response.data.filter(
              (pago: any) => pago.semana === this.data.semana
            );
          }
        },
        error => {
          console.error('Error al cargar filas', error);
        }
      );
    } else {
      console.error('data.id no está definido');
    }
  }

  dismiss() {
    this.modalController.dismiss(); // Cierra el modal
  }
}