import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  usr_id: string='';
  constructor(private http:HttpClient, private servG:GeneralService) { }

  login(ci: string, clave: string) {
    let url = `login/${ci}/${clave}`;
    return this.http.get<any>(this.servG.URLAPI + url);
  }

  setUsrId(usr_id: string) {
    this.usr_id = usr_id;
  }
  getUsserId(): string {
    return this.usr_id;
  }
}
