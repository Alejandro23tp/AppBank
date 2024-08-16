import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class ParticipantesService {


  constructor(
    private http: HttpClient,
    private servG: GeneralService
  ) { }

  listarParticipantes() {
    let url = `listarParticipantes`;
    return this.http.get<any>(this.servG.URLAPI + url);
  }

  registrarParticipante(participante: any) {    
    let url = `registrarParticipante`;
    return this.http.post<any>(this.servG.URLAPI + url, this.servG.objectToFormData({
      part_nombre: participante.nombre,
      part_telefono: participante.telefono,
      part_cupos: participante.cupo
    }));
  }

  obtenerCuposParticipante(part_id: string) {
    let url = `obtenerCupoParticipante`;
    return this.http.post<any>(this.servG.URLAPI + url, this.servG.objectToFormData({
      part_id: part_id
    }));
  }

  
  private selectedParticipanteId: string;

  setSelectedParticipanteId(id: string) {
    this.selectedParticipanteId = id;
  }

  getSelectedParticipanteId(): string {
    return this.selectedParticipanteId;
  }
}
