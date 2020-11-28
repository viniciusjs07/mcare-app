import {Component, OnInit} from '@angular/core';
import {Label, monkeyPatchChartJsTooltip, SingleDataSet, monkeyPatchChartJsLegend} from 'ng2-charts';
import {ChartType, ChartOptions} from 'chart.js';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-scheduling-dashboard',
    templateUrl: './scheduling-dashboard.component.html',
    styleUrls: ['./scheduling-dashboard.component.scss']
})
export class SchedulingDashboardComponent implements OnInit {


    // Pie
    public pieChartOptions: ChartOptions = {
        responsive: true,
    };

    public pieChartLabels: Label[] = [['Atendidos'], ['Não atendidos']];
    public pieChartData: SingleDataSet = [300, 500];
    public pieChartType: ChartType = 'pie';
    public pieChartLegend = true;
    public pieChartPlugins = [];

    professionals = [];
    selectedProfessional = '';
    selectedInitialDate = '';
    selectedFinalDate = '';
    API_SCHEDULE = 'services/scheduling/all_count/';

    scheduleProfessional = new FormGroup({
        date: new FormControl('', []),
        professional: new FormControl('', []),
    });

    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('token')
        })
    };

    constructor(private readonly http: HttpClient) {
        monkeyPatchChartJsTooltip();
        monkeyPatchChartJsLegend();
    }

    ngOnInit() {
        this.loadProfessionals();
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

    setSelectedProfessional(professionalName) {
        this.selectedProfessional = professionalName;
        this.refreshData();
    }

    setSelectedInitialDate(initialDate) {
        this.selectedInitialDate = initialDate;
        this.refreshData();
    }

    setSelectedFinalDate(finalDate) {
        this.selectedFinalDate = finalDate;
        console.log('selectedFinalDate', this.selectedFinalDate);
        this.refreshData();
    }

    refreshData() {
        if (this.selectedProfessional && this.selectedInitialDate && this.selectedFinalDate) {
            const apiRoute = environment.url + this.API_SCHEDULE +
                this.selectedProfessional + `?initial_date=${this.selectedInitialDate}&final_date=${this.selectedFinalDate}`;
            const request = this.http.get(apiRoute, this.httpOptions);
            request.subscribe(
                (response) => {
                    this.pieChartData = [response['attended'], response['not_attended']];
                }, (err) => {
                    console.log(err);
                }
            );
        }
    }
}
