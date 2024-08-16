import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/servicios/general.service';
import { PrestamoService } from 'src/app/servicios/prestamo.service';

@Component({
  selector: 'app-reg-prestamos',
  templateUrl: './reg-prestamos.page.html',
  styleUrls: ['./reg-prestamos.page.scss'],
})
export class RegPrestamosPage implements OnInit {
  defaultInterest = 5; // Interés predeterminado en porcentaje
  currentDate: string = new Date().toISOString().substring(0, 10);

  prestamoData = {
    part_id: '',
    semana: null, // La semana seleccionada
    prestamo: '',
    interes: '', // El valor calculado del interés
    prestamofecha: this.currentDate
  };

  semanas = []; // Array para almacenar las semanas

  constructor(
    private prestamoService: PrestamoService,
    private router: Router,
    private servG: GeneralService,
    private route: ActivatedRoute // Para acceder a los parámetros de navegación
  ) {}

  ngOnInit() {
    this.actualizarEstadoPrestamo();
    // Obtener el part_id de los parámetros de navegación
    this.route.queryParams.subscribe(params => {
      this.prestamoData.part_id = params['part_id'] || '';
    });

    // Inicializar el interés predeterminado
    this.prestamoData.interes = this.defaultInterest.toString(); // Valor predeterminado en porcentaje

    // Construir el arreglo de semanas
    this.semanas = Array.from({ length: 50 }, (_, i) => ({
      numero: i + 1,
      nombre: `Semana ${i + 1}`
    }));
  }

  calcularInteres() {
    const prestamo = parseFloat(this.prestamoData.prestamo);
    const interes = parseFloat(this.prestamoData.interes) / 100; // Convertir porcentaje a fracción
    if (!isNaN(prestamo) && !isNaN(interes)) {
      // Calcular el interés basado en el préstamo y el interés en formato decimal
      const interesCalculado = prestamo * interes;
      this.prestamoData.interes = interesCalculado.toFixed(2); // Actualiza el valor de interés calculado
    }
  }

  validarInteres() {
    const interes = parseFloat(this.prestamoData.interes);
    if (isNaN(interes) || interes < 0) {
      this.servG.fun_Mensaje('El interés debe ser un número válido y positivo.');
      // Restablecer a interés predeterminado en caso de entrada inválida
      this.prestamoData.interes = this.defaultInterest.toString();
    }
  }

  async onSubmit() {
    // Convertir el valor de interés a porcentaje decimal para enviar al backend
    const interesDecimal = parseFloat(this.prestamoData.interes);

    this.prestamoService.registrarPagoPrestamo({
      part_id: this.prestamoData.part_id,
      semana: this.prestamoData.semana,
      prestamo: this.prestamoData.prestamo,
      interes: interesDecimal, // Enviar el interés en formato decimal
      prestamofecha: this.prestamoData.prestamofecha
    }).subscribe(
      async (response) => {
        this.servG.fun_Mensaje('Éxito');
        this.actualizarEstadoPrestamo();
        this.router.navigate(['/participantes']);
      },
      async (error) => {
        this.servG.fun_Mensaje('Error al registrar préstamo');
      }
    );
  }

  actualizarEstadoPrestamo() {
    const semanaLimpiada = this.prestamoData.semana ? this.prestamoData.semana.trim() : '';
    this.prestamoService.actualizarEstadoPrestamo({
      sp_partId: this.prestamoData.part_id,
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
