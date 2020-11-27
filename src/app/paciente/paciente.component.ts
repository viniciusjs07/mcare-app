import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { NotificacoesService } from 'app/servicos/notificacoes.service';

declare var $: any;

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent implements OnInit {

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'authorization': localStorage.getItem('token')
    })
  };

  public users       = [];
  public filterUsers = [];
  public pageUsers   = [];

  public tableData1: TableData;
  public tableData2: TableData;
  public patientToRemove: String;
  public dataRows = [];

  constructor(public router: Router,
              public http: HttpClient,
              public _notificationService: NotificacoesService) {}

  ngOnInit() {
    this.loadPatients();
  }

  addPacienteOnclick () {
    this.router.navigate(['pacientes/addPaciente']);
  }

  loadPatients() {
    const apiRoute = environment.url + 'patients/';
    const request = this.http.get(apiRoute, this.httpOptions);
    request.subscribe(
        (response) => {
          const patients = response['patients'];
          const rows = [];
          let id = 1;
          for (let patient of patients)  {
            const row = [id, patient['name'], patient['gender'], this.formatDate(patient['birthdate']), patient['phone']];
            id = id+1;
            rows.push(row);
          }

          this.users       = rows;
          this.filterUsers = rows;
          this.setPageUsers(1);
        }, (err) => {
          console.log(err);
        }
    );
  }

  public formatDate(date) {
    if (date != null) {
        const splitted  = date.split('-', 3);

        const year = splitted[0];
        const month = splitted[1];
        const day = splitted[2];

        return day + '/' + month + '/' + year;
    }
  }

  onKey(event: KeyboardEvent) {
    const atualSearch = (<HTMLInputElement>event.target).value;
    this.filterByName(atualSearch);
  }

  public filterByName(name: string) {
    this.filterUsers = this.users.filter(
      (elem) => {
        return elem[1].toLowerCase().includes(name.toLowerCase().trim());
      }
    );

    this.setPageUsers(1);
  }

  getPages() {
    if (this.filterUsers) {
      const numberOfPages = Math.ceil((this.filterUsers.length / 7));
      const pages = [];
      for (let i = 0 ; i < numberOfPages ; i++) {
        pages[i] = (i + 1).toString();
      }
      return pages;
    } else {
      return [1];
    }
  }

  setPageUsers(pageNumber: any) {
    if (this.filterUsers !== undefined) {
      if (((pageNumber - 1) * 5) + 5  < this.filterUsers.length) {
        this.pageUsers = this.filterUsers.slice((pageNumber - 1) * 7, ((pageNumber - 1) * 7) + 7);
      } else {
        this.pageUsers = this.filterUsers.slice((pageNumber - 1) * 7, this.filterUsers.length);
      }
    }

    this.tableData1 = {
      headerRow: ['ID', 'Nome', 'Sexo', 'Data de nascimento', 'Contato'],
      dataRows: this.pageUsers
    };

    $('li').removeClass('active');
    $('#' + pageNumber).addClass('active');
  }

  openModal(row) {
    this.patientToRemove = row[1];
    $('#removeModal').appendTo("body").modal('show');
  }

  editPatient(row) {
    this.router.navigate(['/pacientes/' + row[1] + '/Editar']);
  }

  deletePatient() {
    const apiRoute = environment.url + 'patients/' + this.patientToRemove;
    const request  = this.http.delete(apiRoute, this.httpOptions);
    request.subscribe(
      (response) => {
        console.log(response)
        this._notificationService.showNotification(
          'top',
          'right',
          'Paciente removido.',
          2,
          'pe-7s-check'
        );
        this.ngOnInit();
      }, (err) => {
        this._notificationService.showNotification(
          'top',
          'right',
          'Ocorreu um erro ao remover o paciente.',
          4,
          'pe-7s-close'
        );
        window.location.reload();
      }
    ); 
  }

  canRemovePatient() {
    return (atob(localStorage.getItem('_type')) !== 'Professional');
  }
}
