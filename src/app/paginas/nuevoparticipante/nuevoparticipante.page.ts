import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { id } from '@swimlane/ngx-datatable';
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
    cupo: 1,
    id: null
  };
  selectedParticipanteId: string | null = null;
  isEditing: boolean = false;

  constructor(
    private modalController: ModalController,
    private servG: GeneralService,
    private participantesService: ParticipantesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedParticipanteId = params['part_id'] || null;
      if (this.selectedParticipanteId) {
        this.isEditing = true;
        this.cargarDatosParticipante(this.selectedParticipanteId);
      } else {
        console.log('No se seleccionó ningún participante');
        this.isEditing = false;
      }
    });
  }

  cargarDatosParticipante(id: string) {
    this.participantesService.obtenerCuposParticipante(id).subscribe(
      data => {
        this.nuevoParticipante.cupo = data.data.part_cupos;
        this.nuevoParticipante.nombre = data.data.part_nombre;
        this.nuevoParticipante.telefono = data.data.part_telefono;
        this.nuevoParticipante.id = data.data.id;
        console.log('Datos cargados:', data);
      },
      error => {
        console.error('Error al obtener cupos', error);
      }
    );
  }

  cerrarModal() {
    this.servG.irA('/participantes');
  }

  guardarNuevoParticipante() {
    if (!this.nuevoParticipante.nombre || !this.nuevoParticipante.telefono) {
      this.servG.fun_Mensaje('Debe completar todos los campos');
      return;
    }
    this.participantesService.registrarParticipante(this.nuevoParticipante).subscribe(
      (response) => {
        this.servG.fun_Mensaje('Registrado correctamente');
        console.log(response);
        this.servG.irA('/participantes');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  actualizarParticipante() {
    if (!this.selectedParticipanteId) {
      return;
    }
    this.participantesService.actualizarParticipante(this.nuevoParticipante).subscribe(
      (response) => {
        this.servG.fun_Mensaje('Actualizado correctamente');
        console.log(response);
        this.servG.irA('/participantes');
      },
      (error) => {
        console.log(error);
      }
    );
  }
}