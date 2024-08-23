import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/servicios/general.service';
import { PrestamoService } from 'src/app/servicios/prestamo.service';
import { SemanasService } from 'src/app/servicios/semanas.service';
import { SaldoanteriorService } from 'src/app/servicios/saldoanterior.service';
import { formatDate } from '@angular/common';
import { id } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.page.html',
  styleUrls: ['./prestamos.page.scss'],
})
export class PrestamosPage implements OnInit {
  prestamo = {
    part_id: '',
    semana: null,
    valor: '',
    fecha: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
    observaciones: 'Ninguna.'
  };
  private saldoAnterior: any;

  semanas: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private PrestServ: PrestamoService,
    private semanasService: SemanasService,
    private servG: GeneralService,
    private router: Router,
    private sa: SaldoanteriorService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['part_id']) {
        this.prestamo.part_id = params['part_id'];
        // Construir el arreglo de semanas con objetos que contienen el número y el nombre
        this.listarSemanas(this.prestamo.part_id);
      }
    });
    console.log('part_id:', this.prestamo.part_id);
  }
  listarSemanas(part_id: string) {
    this.PrestServ.getPrestamos_Participante(part_id).subscribe(
      Response => {
        console.log('Response LISTADO SEMANAS', Response);
        Response.data.forEach((item: any) => {
          if(item.estado != 'Cancelado'){
            this.semanas.push(item);
            console.log('Semanas filtradas:', this.semanas);
            }
        });
    }
  )};
 /* cargarSemanasPagarPrestamo(partId: string) {
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
  */
  registrarPrestamo() {  
    
    
    //Corregir el prestamo
    //this.prestamo.semana = this.prestamo.semana.pp_semana;
    //this.prestamo.id = this.prestamo.semana.id;
    this.PrestServ.registrarPagosPrestamo({
      part_id: this.prestamo.semana.id,
      semana: this.prestamo.semana.pp_semana,
      valor: this.prestamo.valor,
      fecha: this.prestamo.fecha,
      observaciones: this.prestamo.observaciones
    }).subscribe(
      response => {
        this.servG.fun_Mensaje('Pago de Prestamo registrado', 'success');

        this.sa.conseguirIdSemana_PresentarSemana(this.prestamo.semana.pp_semana).subscribe(resp=>{
          console.log('Respuesta obtenida de la funcion conseguirIdSemana_PresentarSemana:', resp.data[0].id);
          this.sa.calcularSaldoAnterior(resp.data[0].id.toString()).subscribe(respSaldoAnterior=>{
            console.log('saldo anterior calculado', respSaldoAnterior);
          });
        });
        this.servG.irA('/participantes');
     /*  this.actualizarEstadoPrestamo();
        
        const data = { semana: this.prestamo.semana };
        
        // Suscribirse al Observable para obtener el saldo anterior
        this.sa.calcularSaldoAnterior(data).subscribe(
          saldoAnteriorResponse => {
            this.saldoAnterior = saldoAnteriorResponse.saldo_anterior_calculado;
            console.log('Saldo anterior:', this.saldoAnterior);
            
            const data2 = { semana: this.prestamo.semana, saldo: this.saldoAnterior };
            console.log('Datos a insertar:', data2);
            
            // Insertar el saldo anterior
            this.sa.insertarSaldoAnterior(data2).subscribe(
              insertResponse => {
                console.log('Saldo anterior insertado correctamente', insertResponse);
                this.router.navigate(['/participantes']);
              },
              insertError => {
                console.error('Error al insertar saldo anterior', insertError);
              }
            );
          },
          error => {
            console.error('Error al calcular saldo anterior', error);
          }
        );*/
      },
      error => {
        console.error('Error al registrar préstamo', error);
      }
    );
  }
  
  
/*
  actualizarEstadoPrestamo() {
    // Limpiar el valor de la semana eliminando los espacios en blanco
    const semanaLimpiada = this.prestamo.semana.trim();

    this.PrestServ.actualizarEstadoPrestamo({
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
  }*/
}
