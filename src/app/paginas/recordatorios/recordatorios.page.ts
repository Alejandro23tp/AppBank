import { Component, OnInit } from '@angular/core';
import { ParticipantesService } from 'src/app/servicios/participantes.service';
import { SemanasService } from 'src/app/servicios/semanas.service';
import { jsPDF } from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import * as Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { PrestamoService } from 'src/app/servicios/prestamo.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-recordatorios',
  templateUrl: './recordatorios.page.html',
  styleUrls: ['./recordatorios.page.scss'],
})
export class RecordatoriosPage implements OnInit {
  selectedSemana: string;
  semanas: string[] = [];
  participantes: any[] = [];
  private docxTemplateUrl = 'assets/FormatoBMA.docx';

  constructor(
    private semanasService: SemanasService,
    private participantesService: ParticipantesService,
    private http: HttpClient,
    private prestamosserv : PrestamoService
  ) {}

  ngOnInit() {
    this.crearSemanas();
    this.listarParticipantes();
  }

  crearSemanas(): void {
    for (let i = 1; i <= 50; i++) {
      this.semanas.push(`Semana ${i}`);
    }
  }
  cargarParticipantes() {
    console.log(this.selectedSemana);
    this.semanasService.ObenerParticipantesSinCancelarSemanal(this.selectedSemana).subscribe(response => {
      console.log('response', response);
      if (response && response.data) {
        const participantesData = response.data;
        const participantes: any[] = []; // Array para almacenar los participantes únicos

        // Función para verificar si el nombre ya está en el array
        const isDuplicate = (nombre: string) => participantes.some(p => p.part_nombre === nombre);

        // Usamos Promesas para manejar las consultas en paralelo
        const obtenerParticipantesPromises = participantesData.map(p => 
          this.participantesService.obtenerCuposParticipante(p.id).toPromise()
        );

        Promise.all(obtenerParticipantesPromises)
          .then(responses => {
            responses.forEach((response: any) => {
              if (response && response.data) {
                const { part_nombre, part_telefono, part_cupos, id } = response.data;
                
                // Solo agregamos si no es un duplicado
                if (!isDuplicate(part_nombre)) {
                  participantes.push({
                    part_nombre,
                    part_telefono,
                    part_cupos,
                    part_id: id
                  });
                }
              } else {
                console.log('No se encontraron datos válidos en response.data');
              }
            });
            
            // Actualizamos el array de participantes
            this.participantes = participantes;
            console.log('Participantes:', this.participantes);
          })
          .catch(error => console.error('Error al cargar participantes:', error));
      }
    },
    error => console.error('Error al cargar participantes:', error));
  }

  cargarParticipantes2() {
    this.prestamosserv.prestamistasCancelaron("Pendiente", this.selectedSemana).subscribe(response => {
      if (response && response.data) {
        const participantesData = response.data;
        const participantes: any[] = []; // Array para almacenar los participantes únicos

        // Función para verificar si el nombre ya está en el array
        const isDuplicate = (nombre: string) => participantes.some(p => p.part_nombre === nombre);

        // Usamos Promesas para manejar las consultas en paralelo
        const obtenerParticipantesPromises = participantesData.map(p => 
          this.participantesService.obtenerCuposParticipante(p.pp_partId).toPromise()
        );

        Promise.all(obtenerParticipantesPromises)
          .then(responses => {
            responses.forEach((response: any) => {
              if (response && response.data) {
                const { part_nombre, part_telefono, part_cupos, id } = response.data;
                
                // Solo agregamos si no es un duplicado
                if (!isDuplicate(part_nombre)) {
                  participantes.push({
                    part_nombre,
                    part_telefono,
                    part_cupos,
                    part_id: id
                  });
                }
              } else {
                console.log('No se encontraron datos válidos en response.data');
              }
            });
            
            // Actualizamos el array de participantes
            this.participantes = participantes;
            console.log('Participantes:', this.participantes);
          })
          .catch(error => console.error('Error al cargar participantes:', error));
      }
    },
      error => console.error('Error al cargar participantes:', error)
    );
  }


  listarParticipantes() {
    this.participantesService.listarParticipantes().subscribe(
      response => {
        if (response && response.data) {
          this.participantes = response.data;
        } else {
          console.warn('No se encontraron participantes');
        }
      },
      error => console.error('Error al listar participantes:', error)
    );
  }

  enviarWhatsApp(participante: any) {
    let message = '';
  
    if (this.selectedSegment === 'semana') {
      const valor = participante.part_cupos * 10; // Calcula el valor
      message = `Hola ${participante.part_nombre}, este es un recordatorio de tu pago de la ${this.selectedSemana} con un valor de $${valor}.`;
    } else if (this.selectedSegment === 'prestamo') {
      message = `Estimado/a ${participante.part_nombre},\n\nLe recordamos que tiene pagos de préstamos e intereses pendientes. Es fundamental que realice su pago a tiempo para evitar cualquier inconveniente y mantener su historial crediticio en buen estado.\n\nGracias por su colaboración y por ser parte del Banco Manos Amigas. Su compromiso con el cumplimiento de sus obligaciones nos permite seguir apoyando a toddos los socios.\n\n¡No olvide realizar su pago a la brevedad posible!\n\nAtentamente,\nBanco Manos Amigas`;
    }
  
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/+593${participante.part_telefono}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }
  
  
  

  generarYEnviarDocx(participante: any) {
    console.log('id:',participante);
    this.semanasService.getSemanas_Participante(participante.id).subscribe({
      next: async (response) => {
        console.log('response', response);
        if (response) {
          //console.log('semanas', participante);
          await this.generarDocx(participante, response.data);
        } else {
          console.warn('No se encontraron semanas para el participante');
        }
      },
      error: (err) => {
        console.error('Error al obtener semanas del participante:', err);
      }
    });
  }

  private async generarDocx(participante: any, semanas: any[]) {
    this.http.get(this.docxTemplateUrl, { responseType: 'arraybuffer' }).subscribe({
      next: (arrayBuffer) => {
        try {
          // Cargar la plantilla en PizZip
          const zip = new PizZip(arrayBuffer);
          const doc = new Docxtemplater(zip);
  
          // Verificar y procesar la estructura de los datos
          console.log('Datos de semanas:', semanas);
  
          let saldo = 0;
          const semanasData = semanas.map((semana) => {
            // Verificar cada propiedad para asegurar que no esté undefined
            const valor = parseFloat(semana.valor) || 0; // Convertir a número y manejar caso de valor no definido
            const nombreSemana = semana.nombre_semana || 'Desconocida'; // Valor predeterminado si es undefined
            const fecha = semana.fecha_pago || 'Desconocida'; // Valor predeterminado si es undefined
  
            saldo += valor;
            return {
              fecha: fecha,
              semana: nombreSemana,
              valor: valor.toFixed(2), // Asegurarse de que el valor tenga 2 decimales
              saldo: saldo.toFixed(2), // Asegurarse de que el saldo tenga 2 decimales
            };
          });
  
          // Configurar los datos que se inyectarán en la plantilla DOCX
          doc.setData({
            nombreparticipante: participante.part_nombre,
            partId: participante.id,
            cupo: participante.part_cupos,
            part_telefono: participante.part_telefono,
            semanas: semanasData,
          });
  
          // Renderizar el documento con los datos
          doc.render();
  
          // Generar el documento como un blob y guardarlo
          const output = doc.getZip().generate({ type: 'blob' });
          saveAs(output, `${participante.part_nombre}_reporte.docx`);
        } catch (error) {
          console.error('Error al generar el documento:', error);
        }
      },
      error: (err) => {
        console.error('Error al cargar la plantilla .docx:', err);
      }
    });
  }
  
  selectedSegment: string = 'semana';

onSemanaChange() {
  if (this.selectedSegment === 'semana') {
    this.cargarParticipantes();
  } else if (this.selectedSegment === 'prestamo') {
    this.cargarParticipantes2();
  }
}

}
