import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  usr_id: string='';
  private environment = environment.apibank;
  constructor(private http:HttpClient) { }

  login(objlogin: any) {
    const url = `${this.environment}login`;
    return this.http.post<any>(url, {
      usr_correo: objlogin.usr_correo,
      password: objlogin.password
    });
  }

  setUsrId(usr_id: string) {
    this.usr_id = usr_id;
  }
  getUsserId(): string {
    return this.usr_id;
  }
}
