import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { environment } from './../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SemanasService {
  private environment = environment.apibank;
  constructor(private http:HttpClient,
    private servG: GeneralService
  ) { }

  getSemanas_Participante(id:String){
    const url = `${this.environment}listarSemId`;
    return this.http.post<any>(url,{
      "part_id": id
    });

  }

  registrarPagoSemanal(data: any) {
    const url = `${this.environment}semanas/mutate`;
    return this.http.post(url, {
      mutate: [
        {
          operation: 'create',
          attributes: {
            part_id: data.part_id,
            nombre_semana: data.semana,
            valor: data.valor,
            fecha_pago: data.fecha,
            responsable: data.responsable,
            inicioSemana: data.inicioSemana
          },
        },
      ],
    });
  }

  conseguirDatosSemanas() {
    const url = `${this.environment}listarAllPresentarSemanas`;
    return this.http.get<any>(url);
  }
  

 ObenerParticipantesSinCancelarSemanal(semana:string){
  const url = `${this.environment}obtenerParticipantesNoEnSemana`;
    return this.http.post<any>(url,{
      Semana: semana
    })  
  }
}
