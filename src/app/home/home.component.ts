import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'environments/environment';
import {FormControl, FormGroup} from '@angular/forms';
import * as jspdf from 'jspdf';
import * as html2canvas from 'html2canvas';
import {NotificacoesService} from 'app/servicos/notificacoes.service';


declare var $: any;


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('token')
        })
    };

    reportForm = new FormGroup({
        date: new FormControl('', []),
        initialDate: new FormControl('', []),
        finalDate: new FormControl('', []),
        professional: new FormControl('', []),
        patient: new FormControl('', [])
    });


    public radioValue = 1;
    public professionals = [];
    public report: any;

    constructor(public http: HttpClient,
                public _notificationService: NotificacoesService) {
    }

    ngOnInit() {
        this.loadProfessionals();
    }

    setRadioValue(value: number) {
        this.radioValue = value;
    }

    generateReport() {
        if (this.radioValue === 1) {
            this.reportForm.get('initialDate').setValue('');
            this.reportForm.get('finalDate').setValue('');
            this.generateSingleReport();
        } else {
            this.reportForm.get('date').setValue('');
            this.generateSingleReport();
        }
    }

    public captureScreen() {
        const data = document.getElementById('pdfContent');
        html2canvas(data,
            {
                scale: 1
            }).then(canvas => {
            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            const doc = new jspdf('p', 'mm');

            const contentDataURL = canvas.toDataURL('image/png');
            doc.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            doc.save('relatorio-agendamentos.pdf');
            this.ngOnInit();
        });
    }

    public generateSingleReport() {
        const apiUrl = environment.url + 'professionals/report/single';
        const request = this.http.post(apiUrl, this.reportForm.value, this.httpOptions);
        request.subscribe(
            (response) => {
                this.report = response;
                this._notificationService.showNotification(
                    'top',
                    'right',
                    'Relatorio Gerado.',
                    2,
                    'pe-7s-check'
                );
            }, (err) => {
                console.log(err);
                this._notificationService.showNotification(
                    'top',
                    'right',
                    err['error']['message'],
                    4,
                    'pe-7s-close'
                );
                this.ngOnInit();
                this.report = [];
            }
        );
    }

    public loadProfessionals() {
        const apiRoute = environment.url + 'professionals/';
        const request = this.http.get(apiRoute, this.httpOptions);
        request.subscribe(
            (response) => {
                this.professionals = response['professionals'];
            }, (err) => {
                console.log(err);
            }
        );
    }

    formatDate(date) {
        if (date != null) {
            const splitted = date.split('-', 3);
            const year = splitted[0];
            const month = splitted[1];
            const day = splitted[2];
            return day + '/' + month + '/' + year;
        }
    }
}
