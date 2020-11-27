import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http"; 
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NotificacoesService } from 'app/servicos/notificacoes.service';
import * as jspdf from 'jspdf';
import * as html2canvas from "html2canvas";

declare var $: any;

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'app-exames',
  templateUrl: './exames.component.html',
  styleUrls: ['./exames.component.scss']
})
export class ExamesComponent implements OnInit {

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
    type: new FormControl('',[
      Validators.required
    ])
  });

  requestForm: FormGroup;

  public tableData1: TableData;
  public tableData2: TableData;

  public examToRemove;
  public selectedExams = [];
  public examRequest: boolean;

  public examTypeSelected = ''

  constructor(public router: Router,
              public http: HttpClient,
              public _notificationService: NotificacoesService) {}

  ngOnInit() {
    this.loadExams('Exame Complementar');
    this.examToRemove = null;
    this.selectedExams = [];
    this.examRequest = false;
  }

  addFuncionarioOnclick () {
    this.router.navigate(["funcionarios/addFuncionario"]);
  }

  loadExams(type: string) {
    this.selectedExams = [];
    this.examTypeSelected = type;
    const apiRoute = environment.url + 'exams/' + type;
    const request = this.http.get(apiRoute, this.httpOptions);
    request.subscribe(
      (response) => {
        const exams = response['plans'];
        const rows = [];
        for (let exam of exams)  {
          const row = [exam['name']];
          rows.push(row);
        }
        this.tableData1 = {
            headerRow: ['Nome'],
            dataRows: rows
        };
      }, (err) => {
          console.log(err);
      }
    );
  }

  createExam() {
    const apiRoute= environment.url + 'exams/create';
    console.log(this.createForm.value);
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
    this.createForm.get('name').setValue('');
    $('#createModal').appendTo("body").modal('show');
  }

  initiateRemove(examToRemove) {
    this.examToRemove = examToRemove[0];
    $('#removeModal').appendTo("body").modal('show');
  }

  finishDelete() {
    const apiRoute= environment.url + 'exams/' + this.examToRemove;
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
        this.examToRemove = null;
        this.ngOnInit();
      }, (err) => {
        this._notificationService.showNotification(
          'top',
          'right',
          'Erro ao remover exame.',
          4,
          'pe-7s-close'
        );
      }
    );
  }

  selectExam(examChanged) {
    if(this.selectedExams.includes(examChanged)) {
      this.selectedExams = this.selectedExams.filter((item) => {
        return item !== examChanged;
      });
    } else {
      this.selectedExams.push(examChanged);
    }
  }

  generateRequest() {
    const atualDate = new Date(Date.now());
    const stringDate = atualDate.getDate() + ' de ' + this.getMonthString(atualDate.getMonth() + 1 ) + ' de ' + atualDate.getFullYear() 
    if (this.selectedExams.length > 0 ) {
      this.requestForm = new FormGroup({
        patientName: new FormControl('',[
          Validators.required
        ]),
        hd: new FormControl('', []),
        exams: new FormControl(this.selectedExams, []),
        date: new FormControl(stringDate, [])
      });
      $('#nameModal').appendTo("body").modal('show');
    } else {
      this._notificationService.showNotification(
        'top',
        'right',
        'Você deve selecionar ao menos um exame.',
        4,
        'pe-7s-close'
      );
    }
  }

  cancelRequest() {
    this.loadExams(this.examTypeSelected);
  }

  finishRequest() {
    this.examRequest = true;
  }

  cancelGenerate() {
    this.selectedExams = [];
    this.cancelRequest();
  }

  public captureScreen(){  
    var data = document.getElementById('pdfContent');  
    html2canvas(data, 
      {
        scale: 2
      }).then(canvas => {    
      var imgWidth = 210;   
      var pageHeight = 297;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save('solicitacao-exames.pdf'); // Generated PDF
      this.selectedExams = [];
      this.loadExams(this.examTypeSelected);
    });  
  }

  getMonthString(monthNumber: number) {
    if (monthNumber === 1) {
      return 'Janeiro';
    }
    else if (monthNumber === 1) {
      return 'Fevereiro';
    }
    else if (monthNumber === 3) {
      return 'Março';
    }
    else if (monthNumber === 4) {
      return 'Abril';
    }
    else if (monthNumber === 5) {
      return 'Maio';
    }
    else if (monthNumber === 6) {
      return 'Junho';
    }
    else if (monthNumber === 7) {
      return 'Julho';
    }
    else if (monthNumber === 8) {
      return 'Agosto';
    }
    else if (monthNumber === 9) {
      return 'Setembro';
    }
    else if (monthNumber === 10) {
      return 'Outubro';
    }
    else if (monthNumber === 11) {
      return 'Novembro';
    }
    else {
      return 'Dezembro';
    }
  }

}
