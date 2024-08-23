import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ParticipantesModalComponent } from 'src/app/participantes-modal/participantes-modal.component';
import { GeneralService } from 'src/app/servicios/general.service';
import { SemanasService } from 'src/app/servicios/semanas.service';
import { ModalController } from '@ionic/angular';
import { PrestamoService } from 'src/app/servicios/prestamo.service';
import { ParticipantesService } from 'src/app/servicios/participantes.service';

@Component({
  selector: 'app-semanal',
  templateUrl: './semanal.page.html',
  styleUrls: ['./semanal.page.scss'],
})
export class SemanalPage implements OnInit {
  filas: any[] = [];
  prestamistas: any[] = [];


  constructor(
    private semanasService: SemanasService, 
    private modalController: ModalController,
    private prestamoService: PrestamoService,
    private participantesService: ParticipantesService
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.semanasService.conseguirDatosSemanas().subscribe(
      (response: any) => {
        if (response.data) {
          let saldoAcumulado = 0; // Inicializa el saldo acumulado
          let saldoAcumuladoAnterior = 0; // Inicializa el saldo acumulado anterior 
          let almacenandoPrestamos = 0;
    
          // Mapear los datos de la semana a filas
          this.filas = response.data.map((dato: any) => {
            console.log(dato);
            const prestamosPagado = dato.prestamospagado === null ? 0 : parseFloat(dato.prestamospagado);
            const totalInteres = dato.totalinteres === null ? 0 : dato.totalinteres;
            
            // Actualiza el saldo acumulado sumando SaldoAnterior y PrestamosPagado
            almacenandoPrestamos += prestamosPagado;
            saldoAcumulado = parseFloat(dato.saldoanterior) + almacenandoPrestamos;

            return {
              Semana: dato.semana,
              TotalSemana: dato.totalsemana,
              TotalPrestamos: dato.totalprestamos,
              totalinteres: totalInteres,
              prestamoscancelado: prestamosPagado,
              SaldoAnterior: saldoAcumulado, // Usa el saldo acumulado actualizado
              Participantes: [], // Inicialmente vacío
              expand: false
            };
          });
    
          // Cargar prestamistas de todas las semanas
          this.listarPrestamistas();
        }
      },
      (error) => {
        console.error('Error al cargar los datos', error);
      }
    );
    
  }

  listarPrestamistas() {
    this.prestamoService.listarPrestamismas().subscribe(
      (response: any) => {
        if (response.data) {
          // Iterar sobre cada fila para asignar sus prestamistas correspondientes
          this.filas.forEach(fila => {
            fila.Participantes = response.data
              .filter((dato: any) => dato.pp_semana === fila.Semana) // Filtrar por semana
              .map((dato: any) => ({
                participante: dato.pp_partId,
                prestamo: dato.pp_prestamo,
                interes: dato.interes,
                fecha_pago: dato.fecha_pago,
                estado: dato.estado
              }));
          });

          // Buscar nombres de participantes para cada fila
          this.filas.forEach(fila => this.buscarNombreParticipante(fila.Participantes));
        }
      },
      (error) => {
        console.error('Error al listar los prestamistas', error);
      }
    );
  }

  buscarNombreParticipante(participantes: any[]) {
    participantes.forEach(participante => {
      this.participantesService.obtenerCuposParticipante(participante.participante).subscribe(
        (response: any) => {
          if (response.data) {
            participante.participante = response.data.part_nombre;
          }
        },
        (error) => {
          console.error('Error al cargar los nombres de los participantes', error);
        }
      );
    });
  }

  async openParticipantesModal(row: any) {
    const modal = await this.modalController.create({
      component: ParticipantesModalComponent,
      componentProps: {
        data: row
      }
    });
    return await modal.present();
  }
}