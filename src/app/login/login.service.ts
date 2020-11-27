import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'authorization': ''
    })
  };

  constructor(public router: Router,
              public http: HttpClient) {

  }

  login(login: String, senha: String) {
    const apiUrl = environment.url + 'mcare/login';
    const body = {
      login: login,
      password: senha
    };
    return this.http.post(apiUrl, body, this.httpOptions);
  }
}
