import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private environment = environment.apibank;

  constructor(
    private http:HttpClient,
    private servG:GeneralService
  ) { }
//Este es el pago a cuotas de los prestampmos
  registrarPagosPrestamo(ObjPrestamo:any){ 
    const url = `${this.environment}pagoprestamo/mutate`;
    return this.http.post(url, {
      mutate: [
        {
          operation: 'create',
          attributes: {
            prestpart_id: ObjPrestamo.part_id,
            semana: ObjPrestamo.semana,
            valor: ObjPrestamo.valor,
            fecha: ObjPrestamo.fecha,
            observaciones: ObjPrestamo.observaciones
          },
        },
      ],
    });
  }


//Registra o Inicializa el prestamo de un participante
  registrarPagoPrestamo(data: any) {
    const url = `${this.environment}registrarPrestamo/mutate`;
    return this.http.post(url, {
      mutate: [
        {
          operation: 'create',
          attributes: {
            pp_partId: data.part_id,
            pp_semana: data.semana,
            pp_prestamo: data.prestamo,
            interes: data.interes,
            estado: data.estado,
            fecha_pago: data.fecha
          },
        },
      ],
    });
  }

  getPrestamos_Participante(id:String){
    const url = `${this.environment}listarPrestamosId`;
    return this.http.post<any>(url,{
      "pp_partId": id
    });

  }

  listarPrestamismas(){
    const url = `${this.environment}listarPrestamistas`;
    return this.http.get<any>(url);
  }

  prestamistasCancelaron(estado:string, semana:string){
    const url = `${this.environment}prestamistasCancelar`;
    return this.http.post<any>(url,{
      "estado": estado,
      "pp_semana": semana
    }); 
  }
}