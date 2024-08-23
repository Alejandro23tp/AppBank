import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaldoanteriorService {
  private environment = environment.apibank;
  constructor(private http:HttpClient,
    private servG: GeneralService
  ) { }

  calcularSaldoAnterior(id: string) {
    const url = `${this.environment}calcularSaldoAnterior/${id}`;
    return this.http.get<any>(url);
  }

  conseguirIdSemana_PresentarSemana(semana : string){
    const url = `${this.environment}listarxsemana`;
    return this.http.post<any>(url,{
      "semana": semana
    });
  }
}
