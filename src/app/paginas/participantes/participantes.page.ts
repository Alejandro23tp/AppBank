import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ParticipantesService } from 'src/app/servicios/participantes.service';
import { NuevoparticipantePage } from '../nuevoparticipante/nuevoparticipante.page';
import { ModalController } from '@ionic/angular';
import { SemanasService } from './../../servicios/semanas.service';
import { GeneralService } from 'src/app/servicios/general.service';
import { NavigationExtras } from '@angular/router';
import { Router } from '@angular/router';
import { PrestamoService } from 'src/app/servicios/prestamo.service';
import { ParticipantespagosModalComponent } from 'src/app/participantespagos-modal/participantespagos-modal.component';

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
  prestpart_id: string | null = null;  // Inicialización

  constructor(
    private participantesService: ParticipantesService,
    private cdr: ChangeDetectorRef,
    private modalController: ModalController,
    private semanasService: SemanasService,
    public servG: GeneralService,
    private router: Router,
    private prestserv: PrestamoService
  ) {}

  ngOnInit() {
    this.cargarParticipantes();
  }

  ionViewWillEnter() {
    this.cargarParticipantes(); // Recargar los participantes cuando vuelvas a la página
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
    this.cargarFilas(this.selectedParticipanteId);
  }

  cargarFilas(id: string) {
    this.semanasService.getSemanas_Participante(id).subscribe(
      response => {
        this.filas = response.data.map((item: any) => ({
          semana: item.nombre_semana,
          valor: item.valor,
          fecha: item.fecha_pago,
          responsable: item.responsable
        }));
        
        this.cdr.detectChanges(); 
      },
      error => {
        console.error('Error al cargar filas', error);
      }
    );

    this.prestserv.getPrestamos_Participante(id).subscribe(
      response => {
        this.prestamos = response.data.map((item: any) => ({
          id: item.id,
          semana: item.pp_semana,
          prestamo: item.pp_prestamo,
          interes: item.interes,
          
          fecha: item.fecha_pago,
          estado: item.estado
        }));
        this.cdr.detectChanges(); 
      },
      error => {
        console.error('Error al cargar filas', error);
      }
    );
  }

  async agregarParticipante() {
    const navigationExtras: NavigationExtras = {
      queryParams: { part_id: this.selectedParticipanteId || '' }
    };
    this.router.navigate(['/nuevoparticipante'], navigationExtras);
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

  limpiarPagina() {
    // Vaciar todos los arrays y resetear propiedades
    this.participantes = [];
    this.filas = [];
    this.prestamos = [];
    this.selectedParticipanteId = null;
    this.cargarParticipantes();
    // Llamar a ChangeDetectorRef para asegurarse de que los cambios se reflejen en la UI
    this.cdr.detectChanges();

    console.log('Página limpiada');
  }

  async openParticipantesModal(row: any) {
    const modal = await this.modalController.create({
      component: ParticipantespagosModalComponent,
      componentProps: {
        data: row
      }
    });
    return await modal.present();
  }
}
