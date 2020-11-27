import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NotificacoesService } from "app/servicos/notificacoes.service";
import {LoginService} from './login.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  login = "";
  senha = "";

  constructor(
    public router: Router,
    public _notificationService: NotificacoesService,
    public _loginService: LoginService
  ) {}

  ngOnInit() {
    localStorage.setItem('token', '');
    localStorage.setItem('_type', '');
  }

  public onLoginClick() {
    const request = this._loginService.login(this.login, this.senha);

    request.subscribe(
        (response) => {
          if (response['auth'] === true) {
              this._notificationService.showNotification(
                "top",
                "right",
                "Bem vindo ao seu sistema de controle.",
                2,
                "pe-7s-check"
              );
              localStorage.setItem('token', response['token']);
              localStorage.setItem('_type', btoa(response['_type']));
              this.router.navigate(['./pacientes']);
          } else {
              this._notificationService.showNotification(
                "top",
                "right",
                "Ocorreu um erro ao realizar login. Por favor, tente novamente.",
                4,
                "pe-7s-close"
              );
          }
        }, (err) => {
          console.log(err);
          this._notificationService.showNotification(
            "top",
            "right",
            "Credenciais inválidas. Tente novamente.",
            4,
            "pe-7s-close"
          );
        }
    );
  }
}
