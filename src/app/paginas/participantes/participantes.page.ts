import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ParticipantesService } from 'src/app/servicios/participantes.service';
import { NuevoparticipantePage } from '../nuevoparticipante/nuevoparticipante.page';
import { ModalController } from '@ionic/angular';
import { SemanasService } from './../../servicios/semanas.service';
import { GeneralService } from 'src/app/servicios/general.service';
import { NavigationExtras } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-participantes',
  templateUrl: './participantes.page.html',
  styleUrls: ['./participantes.page.scss'],
})
export class ParticipantesPage implements OnInit {
  participantes: any[] = [];
  filas: any[] = [];
  prestamos: any[] = [];
  selectedParticipanteId: string | null = null;  // Inicialización

  constructor(
    private participantesService: ParticipantesService,
    private cdr: ChangeDetectorRef,
    private modalController: ModalController,
    private semanasService: SemanasService,
    public servG: GeneralService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarParticipantes();
  }

  ionViewWillEnter() {
    this.selectedParticipanteId = this.participantesService.getSelectedParticipanteId();
    if (this.selectedParticipanteId) {
      this.cargarFilas(this.selectedParticipanteId);
    }
  }

  cargarParticipantes() {
    this.participantesService.listarParticipantes().subscribe(
      data => {
        this.participantes = data.data;
      },
      error => {
        console.error('Error al listar participantes', error);
      }
    );
  }

  seleccionarParticipante(event: CustomEvent<any>) {
    this.selectedParticipanteId = event.detail.value.toString();
    this.participantesService.setSelectedParticipanteId(this.selectedParticipanteId);
    console.log('Participante seleccionado:', this.selectedParticipanteId);
    this.cargarFilas(this.selectedParticipanteId);
  }

  cargarFilas(id: string) {
    this.semanasService.getSemanas_Participante(id).subscribe(
      data => {
        this.filas = data.semanas.map((item: any) => ({
          semana: item.sp_Snombre,
          valor: item.sp_valor,
          fecha: item.sp_fecha,
          responsable: item.sp_responsable,
          estado: item.sp_estado
        }));
        
        this.prestamos = data.semanas.filter((item: any) => item.sp_prestamo != 0).map((item: any) => ({
          semana: item.sp_Snombre,
          prestamo: item.sp_prestamo,
          interes: item.sp_interesp,
          fecha: item.sp_prestamofecha,
          estado: item.estadoprestamo
        }));
        
        console.log('Datos mapeados:', this.filas, this.prestamos);
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error al cargar filas', error);
      }
    );
  }

  async agregarParticipante() {
    const modal = await this.modalController.create({
      component: NuevoparticipantePage,
      componentProps: {}
    });

    modal.onDidDismiss().then((data) => {
      if (data && data.data) {
        this.cargarParticipantes();
      }
    });

    await modal.present();
  }

  agregarPagoSemanal() {
    const navigationExtras: NavigationExtras = {
      queryParams: { part_id: this.selectedParticipanteId }
    };
    this.router.navigate(['/pagosemanal'], navigationExtras);
  }

  pagarPrestamo() {
    const navigationExtras: NavigationExtras = {
      queryParams: { part_id: this.selectedParticipanteId }
    };
    this.router.navigate(['/prestamos'], navigationExtras);
  }

  reg_prestamo() {
    const navigationExtras: NavigationExtras = {
      queryParams: { part_id: this.selectedParticipanteId }
    };
    this.router.navigate(['/reg-prestamos'], navigationExtras);
  }
}
