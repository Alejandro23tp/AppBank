import { PrestamoService } from 'src/app/servicios/prestamo.service';
import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { GeneralService } from 'src/app/servicios/general.service';
import { LoginService } from 'src/app/servicios/login.service';
import { ParticipantesService } from 'src/app/servicios/participantes.service';
import { SaldoanteriorService } from 'src/app/servicios/saldoanterior.service';
import { SemanasService } from 'src/app/servicios/semanas.service';

@Component({
  selector: 'app-pagosemanal',
  templateUrl: './pagosemanal.page.html',
  styleUrls: ['./pagosemanal.page.scss'],
})
export class PagosemanalPage implements OnInit {
  saldoAnterior: any;
  part_id: string;
  semanas: any[] = []; // Usaremos un arreglo de objetos para las semanas
  cupos: number = 0; // Cupos por defecto
  pago: any = {
    semana: null, // Aquí guardaremos el objeto completo de la semana seleccionada
    valor: null,
    fecha: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
    responsable: '',
    estado: 'P'
  };
  prestamo: any = {
    cantidad: null,
    interes: null,
    fecha: null
  };
  

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private semanasService: SemanasService,
    private userlogin: LoginService,
    private participantesService: ParticipantesService,
    private servG: GeneralService,
    private sa: SaldoanteriorService,
    private PrestServ: PrestamoService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['part_id']) {
        this.part_id = params['part_id'];
        console.log('part_id recibido:', this.part_id);
        this.cargarCupos();
      }
      //this.cargarCupos();
    });

    // Construir el arreglo de semanas con objetos que contienen el número y el nombre
   this.semanas = Array.from({ length: 50 }, (_, i) => ({
      numero: i + 1,
      nombre: `Semana ${i + 1}`
      }));

    } 
  cargarCupos() {
    this.participantesService.obtenerCuposParticipante(this.part_id).subscribe(
      Response => {
        console.log('Cupos obtenidos:', Response);
        this.cupos = Response.data.part_cupos;
        console.log('Cupos obtenidos:', this.cupos);
        this.actualizarValor();
      },
      error => {
        console.error('Error al cargar cupos', error);
      }
    );
  }

  actualizarValor() {
    this.pago.valor = this.cupos * 10; // Ajustar el valor del pago según el cupo
  }

  realizarPagoSemanal() {
    const pagoSemanalData = {
      part_id: this.part_id,
      semana: "Semana "+this.pago.semana.numero,
      valor: this.pago.valor,
      fecha: this.pago.fecha,
      responsable: this.userlogin.getUsserId(),
      inicioSemana: this.calcularInicioSemana(),
    };

    this.semanasService.getSemanas_Participante(this.part_id).subscribe(
      response => {
        const array = response.data;
        let elementoEncontrado = false; // Variable para controlar si se encuentra el elemento
    
        for (const element of array) {
          if (element.nombre_semana === pagoSemanalData.semana) {
            elementoEncontrado = true;
            this.servG.fun_Mensaje('El pago semanal ya se encuentra registrado', 'warning');
            break; // Salir del bucle cuando se encuentra el elemento
          }
        }
    
        if (!elementoEncontrado) {
          this.semanasService.registrarPagoSemanal(pagoSemanalData).subscribe(data => {
            this.servG.fun_Mensaje('Pago semanal guardado', 'success');
            
            this.sa.conseguirIdSemana_PresentarSemana(pagoSemanalData.semana).subscribe(resp=>{
              console.log('Respuesta obtenida de la funcion conseguirIdSemana_PresentarSemana:', resp.data[0].id);
              this.sa.calcularSaldoAnterior(resp.data[0].id.toString()).subscribe(respSaldoAnterior=>{
                console.log('saldo anterior calculado', respSaldoAnterior);
              });
            });

            this.servG.irA('/participantes');
          });
        }
      }
    );
  }    
/*
    // Llama al servicio para guardar el pago semanal en el servidor
     

      const semanas= pagoSemanalData.semana;
      this.sa.calcularSaldoAnterior(pagoSemanalData).subscribe(
        respSaldoAnterior => {
          this.saldoAnterior = respSaldoAnterior.saldo_anterior_calculado;
          console.log('Saldo anterior:', this.saldoAnterior);

          const data2 = { semana: semanas, saldo: this.saldoAnterior };
          console.log('Datos a insertar:', data2);
          this.sa.insertarSaldoAnterior(data2).subscribe(insertResponse => {
            console.log('Saldo anterior insertado correctamente', insertResponse);
          }, insertError => {
            console.error('Error al insertar saldo anterior', insertError);
          });
      });
      this.servG.irA('/participantes');
    },
    error => {
      console.error('Error al guardar pago semanal', error);
    });

    */

  // Método para calcular la fecha de inicio de la semana seleccionada
  calcularInicioSemana() {
    if (this.pago.semana && this.pago.semana.numero) {
      const numeroSemana = this.pago.semana.numero;
      const currentYear = new Date(this.pago.fecha).getFullYear(); // Obtener el año actual

      // Calcular la fecha de inicio de la semana seleccionada (asumiendo Lunes como inicio de semana)
      const inicioAnio = new Date(currentYear, 0, 1); // Primer día del año actual
      const inicioSemana = new Date(inicioAnio);

      // Ajustar el inicio de la semana según el número de semana seleccionado
      inicioSemana.setDate(inicioAnio.getDate() + (numeroSemana - 1) * 7);

      return inicioSemana.toISOString().substring(0, 10); // Devolver la fecha en formato ISO (YYYY-MM-DD)
    } else {
      return null; // Manejar el caso cuando no se ha seleccionado ninguna semana
    }
  }

}
