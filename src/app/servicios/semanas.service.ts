import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class SemanasService {

  constructor(private http:HttpClient,
    private servG: GeneralService
  ) { }

  getSemanas_Participante(id:String){
    let url = 'obtenerSemanasPorParticipante'
    return this.http.post<any>(
      this.servG.URLAPI + url,
      this.servG.objectToFormData({
        sp_partId: id
    })
  );
  }

  registrarPagoSemanal(data: any) {
    let url = 'registrarSemanaParticipante'
    return this.http.post<any>(
      this.servG.URLAPI + url,
      this.servG.objectToFormData({
        sp_partId: data.part_id,
        sp_Snombre: data.semana,
        sp_valor: data.valor,
        sp_fecha: data.fecha,
        sp_responsable: data.responsable,
        sp_estado: data.estado,
        sp_prestamo: data.prestamo,
        sp_interesp: data.interes,
        sp_prestamofecha: data.prestamofecha
      })
    );
  }
}
