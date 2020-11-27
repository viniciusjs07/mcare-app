import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http"; 
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NotificacoesService } from 'app/servicos/notificacoes.service';

declare var $: any;

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'app-plano-de-saude',
  templateUrl: './plano-de-saude.component.html',
  styleUrls: ['./plano-de-saude.component.scss']
})

export class PlanoDeSaudeComponent implements OnInit {

  public httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'authorization': localStorage.getItem('token')
    })
  };

  createForm = new FormGroup({
    name: new FormControl('',[
      Validators.required
    ]),
    discount: new FormControl(0, [
      Validators.required
    ])
  });

  public tableData1: TableData;
  public tableData2: TableData;

  public planToRemove;

  public isEditMode = false;

  constructor(public router: Router,
              public http: HttpClient,
              public _notificationService: NotificacoesService) {}

  ngOnInit() {
    this.loadPlans();
    this.planToRemove = null;
  }

  addFuncionarioOnclick () {
    this.router.navigate(["funcionarios/addFuncionario"]);
  }

  loadPlans() {
    const apiRoute = environment.url + 'plans/';
    const request = this.http.get(apiRoute, this.httpOptions);
    request.subscribe(
      (response) => {
        const plans = response['plans'];
        const rows = [];
        for (let plan of plans)  {
          const row = [plan['name'], plan['discount']];
          rows.push(row);
        }
        this.tableData1 = {
            headerRow: ['Nome', 'Percentual de Desconto (%)', 'Editar', 'Remover'],
            dataRows: rows
        };
      }, (err) => {
          console.log(err);
      }
    );
  }

  createPlan() {
    const apiRoute= environment.url + 'plans/create';
    const request = this.http.post(apiRoute, this.createForm.value, this.httpOptions);
    request.subscribe(
      (response) => {
        this._notificationService.showNotification(
          'top',
          'right',
          response['message'],
          2,
          'pe-7s-check'
        );
        this.ngOnInit();
      }, (err) => {
        this._notificationService.showNotification(
          'top',
          'right',
          'Erro ao cadastrar atendimento. Verifique se as informações estão corretas e tente novamente.',
          4,
          'pe-7s-close'
        );
      }
    );
  }

  openModal() {
    this.isEditMode = false;
    this.createForm.get('name').setValue('');
    this.createForm.get('discount').setValue(0);
    $('#createModal').appendTo("body").modal('show');
  }

  initiateEdit(atualInfo) {
    this.isEditMode = true;
    this.createForm.get('name').setValue(atualInfo[0]);
    this.createForm.get('name').disable();
    this.createForm.get('discount').setValue(atualInfo[1]);
    $('#createModal').appendTo("body").modal('show');
  }

  finishEdit() {
    const apiRoute= environment.url + 'plans/' + this.createForm.get('name').value;
    const request = this.http.put(apiRoute, this.createForm.value, this.httpOptions);
    request.subscribe(
      (response) => {
        this._notificationService.showNotification(
          'top',
          'right',
          response['message'],
          2,
          'pe-7s-check'
        );
        this.ngOnInit();
      }, (err) => {
        this._notificationService.showNotification(
          'top',
          'right',
          'Erro ao atualizar plano de saúde. Verifique se as informações estão corretas e tente novamente.',
          4,
          'pe-7s-close'
        );
      }
    );
  }

  initiateRemove(planToRemove) {
    this.planToRemove = planToRemove[0];
    $('#removeModal').appendTo("body").modal('show');
  }

  finishDelete() {
    const apiRoute= environment.url + 'plans/' + this.planToRemove;
    const request = this.http.delete(apiRoute, this.httpOptions);
    request.subscribe(
      (response) => {
        this._notificationService.showNotification(
          'top',
          'right',
          response['message'],
          2,
          'pe-7s-check'
        );
        this.ngOnInit();
      }, (err) => {
        this._notificationService.showNotification(
          'top',
          'right',
          'Erro ao remover plano de saúde.',
          4,
          'pe-7s-close'
        );
      }
    );
  }
}
