import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ChartOptions, ChartType, ChartDataSets} from 'chart.js';
import {Color, Label} from 'ng2-charts';

@Component({
    selector: 'app-patients-by-company',
    templateUrl: './patients-by-company.component.html',
    styleUrls: ['./patients-by-company.component.scss']
})
export class PatientsByCompanyComponent implements OnInit {

    API_PACIENTS = 'patients/get_by_company';
    patients = [];
    companies = [];

    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('token')
        })
    };

    public barChartOptions: ChartOptions = {
        responsive: true,
    };

    public barChartLabels: Label[] = [];
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;
    public barChartPlugins = [];


    colors: Color[] = [
        {
            backgroundColor: [
                'green',
                'green',
                'green'
            ]
        }
    ];

    public barChartData: ChartDataSets[] = [
        {data: [], label: 'Quantidade de pacientes'}
    ];

    constructor(private readonly http: HttpClient) {
    }

    ngOnInit() {
        this.refreshData();
    }

    refreshData() {
        const apiRoute = environment.url + this.API_PACIENTS;
        const request = this.http.get(apiRoute, this.httpOptions);
        request.subscribe(
            (response: any) => {
                this.companies = response['companies'];
                this.patients = response['patients_by_companies'];

                this.barChartLabels = this.companies;
                this.barChartData[0].data = this.patients;
            }, (err) => {
                console.log(err);
            }
        );
    }

}
