import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificacoesService } from 'app/servicos/notificacoes.service';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-profissional',
  templateUrl: './add-profissional.component.html',
  styleUrls: ['./add-profissional.component.scss']
})
export class AddProfissionalComponent implements OnInit {

    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'authorization': localStorage.getItem('token')
        })
    };

    addForm = new FormGroup({
        name: new FormControl('', [
            Validators.required
        ]),
        role: new FormControl('', [
            Validators.required
        ]),
        cpf: new FormControl('', [
            Validators.required
        ]),
        rg: new FormControl('', [
            Validators.required
        ]),
        city: new FormControl('', [
            Validators.required
        ]),
        gender: new FormControl('', [
            Validators.required
        ]),
        birthdate: new FormControl('', [
            Validators.required
        ]),
        address: new FormControl('', [
            Validators.required
        ]),
        phone: new FormControl('', [
            Validators.required
        ]),
        maritalStatus: new FormControl('', [
            Validators.required
        ]),
        login: new FormControl('', [
            Validators.required
        ]),
        password: new FormControl('',[
           Validators.required
        ]),
        email: new FormControl('', []),
        country: new FormControl('', []),
        cep: new FormControl('', []),
        expertise: new FormControl('',[
            Validators.required
        ]),
        degree: new FormControl('',[]),
        other: new FormControl('', [])
    });

  constructor(
    public router: Router,
    public _notificationService: NotificacoesService,
    public http: HttpClient
  ) {}

  ngOnInit() {}

  cadastrarOnClick() {
      const apiUrl = environment.url + 'professionals/create';
      const request = this.http.post(apiUrl, this.addForm.value, this.httpOptions);

      if(this.addForm.valid) {
          request.subscribe(
              (response) => {
                  this._notificationService.showNotification(
                      'top',
                      'right',
                      response['message'],
                      2,
                      'pe-7s-check'
                  );
                  this.router.navigate(['./profissionais']);
              }, (err) => {
                  console.log(err);
                  this._notificationService.showNotification(
                      'top',
                      'right',
                      'Erro ao cadastrar paciente. Verifique se as informações estão corretas',
                      4,
                      'pe-7s-close'
                  );
              }
          );
      } else {
          this._notificationService.showNotification(
              'top',
              'right',
              'Formulário inválido ou incompleto. Corrija as informações e tente novamente.',
              4,
              'pe-7s-close'
          );
      }
  }

  cancelarOnClick() {
    this._notificationService.showNotification(
      "top",
      "right",
      "Cadastro cancelado.",
      3,
      "pe-7s-check"
    );
    this.router.navigate(["./profissionais"]);
  }

}
