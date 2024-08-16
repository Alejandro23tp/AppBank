import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  constructor(
    private http:HttpClient,
    private servG:GeneralService
  ) { }

  registrarPagosPrestamo(ObjPrestamo:any){ //ESTE ES DEL prestamos.page.ts que registra en la tabla prestamos_participante
    let url = 'registrarPagosPrestamo';
    return this.http.post<any>(this.servG.URLAPI + url, this.servG.objectToFormData({
      pp_partId: ObjPrestamo.part_id,
      pp_semana: ObjPrestamo.semana,
      pp_pagos: ObjPrestamo.valor,
      pp_fecha: ObjPrestamo.fecha
    }));
  }

  actualizarEstadoPrestamo(ObjPrestamo: any) {
    let url = 'actualizarEstadoPrestamo';
    return this.http.post<any>(
      this.servG.URLAPI + url,
      this.servG.objectToFormData({
        sp_partId: ObjPrestamo.sp_partId,
        sp_Snombre: ObjPrestamo.sp_Snombre
      })
    );
  }


  registrarPagoPrestamo(data: any) {
    let url = 'registrarSemanaParticipante'; // Verifica si este es el endpoint correcto
    return this.http.post<any>(
      this.servG.URLAPI + url,
      this.servG.objectToFormData({
        sp_partId: data.part_id,
        sp_Snombre: data.semana,
        sp_prestamo: data.prestamo,
        sp_interesp: data.interes,
        sp_prestamofecha: data.prestamofecha
      })
    );
  }
}