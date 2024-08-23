import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private environment = environment.apibank;

  constructor(private http:HttpClient) { }

  listarPagosxId(id: string) {
    const url = `${this.environment}listarpagosid`;
    return this.http.post<any>(url,{
      "prestpart_id": id
    });
  }
}
