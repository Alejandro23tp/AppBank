import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { GeneralService } from 'src/app/servicios/general.service';
import { LoginService } from 'src/app/servicios/login.service';
import { ParticipantesService } from 'src/app/servicios/participantes.service';
import { SemanasService } from 'src/app/servicios/semanas.service';

@Component({
  selector: 'app-pagosemanal',
  templateUrl: './pagosemanal.page.html',
  styleUrls: ['./pagosemanal.page.scss'],
})
export class PagosemanalPage implements OnInit {
  part_id: string;
  semanas: any[] = []; // Usaremos un arreglo de objetos para las semanas
  currentDate: string = new Date().toISOString().substring(0, 10);
  cupos: number = 0; // Cupos por defecto
  pago: any = {
    semana: null, // Aquí guardaremos el objeto completo de la semana seleccionada
    valor: null,
    fecha: this.currentDate,
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
    private servG: GeneralService
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
      data => {
        this.cupos = data.data[0].part_cupos;
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
    // Simula enviar el pago semanal al servidor
    const pagoSemanalData = {
      part_id: this.part_id,
      semana: "Semana "+this.pago.semana.numero,
      valor: this.pago.valor,
      fecha: this.pago.fecha,
      responsable: this.userlogin.getUsserId(),
      estado: 'A',
      prestamo: this.prestamo.cantidad,
      interes: this.prestamo.interes,
      prestamofecha: this.prestamo.fecha
    };

    // Llama al servicio para guardar el pago semanal en el servidor
     this.semanasService.registrarPagoSemanal(pagoSemanalData).subscribe(data => {
      console.log('Pago semanal guardado:', data);
      this.servG.fun_Mensaje('Pago semanal guardado', 'success');
      this.servG.irA('/participantes');
    },
    error => {
      console.error('Error al guardar pago semanal', error);
    });
  }

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
