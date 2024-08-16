import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/servicios/general.service';
import { PrestamoService } from 'src/app/servicios/prestamo.service';
import { SemanasService } from 'src/app/servicios/semanas.service';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.page.html',
  styleUrls: ['./prestamos.page.scss'],
})
export class PrestamosPage implements OnInit {
  currentDate: string = new Date().toISOString().substring(0, 10);
  prestamo = {
    part_id: '',
    semana: '',
    valor: '',
    fecha: this.currentDate
  };

  semanas: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private prestamoService: PrestamoService,
    private semanasService: SemanasService,
    private servG: GeneralService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['part_id']) {
        this.prestamo.part_id = params['part_id'];
        // Construir el arreglo de semanas con objetos que contienen el número y el nombre
        this.cargarSemanasPagarPrestamo(this.prestamo.part_id);
      }
    });
    console.log('part_id:', this.prestamo.part_id);
  }
  
  cargarSemanasPagarPrestamo(partId: string) {
    this.semanasService.getSemanas_Participante(partId).subscribe(
      data => {
        data.semanas.forEach((item: any) => {
          if (item.estadoprestamo === 'P') {
            this.semanas.push(item.sp_Snombre);
          }
        });
  
        console.log('Semanas filtradas:', this.semanas);
      },
      error => {
        console.error('Error al cargar semanas', error);
      }
    );
  }
  
  registrarPrestamo() {
    this.prestamoService.registrarPagosPrestamo({
      part_id: this.prestamo.part_id,
      semana: this.prestamo.semana,
      valor: this.prestamo.valor,
      fecha: this.prestamo.fecha
    }).subscribe(
      response => {
        this.servG.fun_Mensaje('Pago de Prestamo registrado', 'success');
        this.actualizarEstadoPrestamo();
        // Actualizar estado del préstamo después de registrar el pago
      },
      error => {
        console.error('Error al registrar préstamo', error);
      }
    );
  }

  actualizarEstadoPrestamo() {
    // Limpiar el valor de la semana eliminando los espacios en blanco
    const semanaLimpiada = this.prestamo.semana.trim();

    this.prestamoService.actualizarEstadoPrestamo({
      sp_partId: this.prestamo.part_id,
      sp_Snombre: semanaLimpiada
    }).subscribe(
      resp => {
        console.log('Estado de préstamo actualizado correctamente', resp);
      },
      error => {
        console.error('Error al actualizar estado del préstamo', error);
      }
    );
  }
}
