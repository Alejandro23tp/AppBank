import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GeneralService } from 'src/app/servicios/general.service';
import { ParticipantesService } from 'src/app/servicios/participantes.service';
@Component({
  selector: 'app-nuevoparticipante',
  templateUrl: './nuevoparticipante.page.html',
  styleUrls: ['./nuevoparticipante.page.scss'],
})
export class NuevoparticipantePage {
  nuevoParticipante = {
    nombre: '',
    telefono: '',
    cupo: 1
  };

  constructor(
    private modalController: ModalController,
    private servG: GeneralService,
    private participantesService: ParticipantesService
  ) {}

  cerrarModal() {
    this.modalController.dismiss();
  }

  guardarNuevoParticipante() {
    if(!this.nuevoParticipante
    ){
      this.servG.fun_Mensaje('Debe completar todos los campos');
      return;
    }
    this.participantesService.registrarParticipante(this.nuevoParticipante).subscribe(
      (response) => {
        this.servG.fun_Mensaje('Registrado correctamente');
        console.log(response);
        this.modalController.dismiss({
          nuevoParticipante: this.nuevoParticipante
        });
      },
      (error) => {
        console.log(error);
      }
    );

  }
}
