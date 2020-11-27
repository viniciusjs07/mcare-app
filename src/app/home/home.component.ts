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
    public reportKeys = [];
    public professionaPercent = 0;

    constructor(public http: HttpClient,
                public _notificationService: NotificacoesService,) {
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
        } else if (this.radioValue === 2) {
            this.reportForm.get('date').setValue('');
            this.generateSingleReport();
        } else {
            this.reportForm.get('date').setValue('');
            this.generateFinancialReport();
        }
    }

    generateFinancialReport() {
        const apiUrl = environment.url + 'professionals/report/simple';
        const request = this.http.post(apiUrl, this.reportForm.value, this.httpOptions);
        this.report = [];

        request.subscribe(
            (response) => {
                Object['entries'](response).forEach(entry => {
                    this.reportKeys.push(entry[0]);
                    this.report.push(entry[1]);
                });
            }, (err) => {
                console.log(err);
            }
        );
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
        const e = document.getElementById('percentValue');
        const professionaPercent = parseInt(e['options'][e['selectedIndex']]['value']);
        this.professionaPercent = professionaPercent;

        request.subscribe(
            (response) => {
                this.report = response;
                console.log(response);
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

    getTotalValue() {
        let total = 0;
        for (let r of this.report) {
            total = total + r['finalPrice'];
        }

        return total;
    }

    getTotalProfessionalValue() {
        const totalValue = this.getTotalValue();
        return ((this.professionaPercent / 100) * totalValue).toFixed(2);
    }

    getTotalClinicValue() {
        const totalValue = this.getTotalValue();
        return (((100 - this.professionaPercent) / 100) * totalValue).toFixed(2);
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

    getProfessionalPercents() {
        return PROFESSIONAL_PERCENTS;
    }

    percentToString(percent) {
        return percent.toString() + ' %';
    }
}

const PROFESSIONAL_PERCENTS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
